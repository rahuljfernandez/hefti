import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
/* Side-effect import: leaflet-gesture-handling self-registers its `gestureHandling`
   handler on Leaflet's Map (enabled via the map option below) and brings its
   overlay styles. Imported after leaflet so the plugin sees the same L instance. */
import 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import FlushCard from '../atom/flushCard';
import TabsSelector from '../molecule/tabsSelector';
import RatingDistributionLegend from '../molecule/ratingDistributionLegend';
import { Select } from '../atom/select';
import { Heading } from '../atom/heading';
import {
  getStateMapViewport,
  COLOR_BY_TABS,
  DEFAULT_COLOR_BY,
  starDimensionFor,
  starRatingOptions,
  MARGIN_OPTIONS,
  OWNERSHIP_OPTIONS,
  buildFacilitiesMap,
} from '../../../lib/facilitiesMapMetrics';

/**
 * Facilities Across {State}.
 *
 * An interactive Leaflet map that plots every facility in the state, wrapped in
 * a top control card (Color by / Narrow by) and a bottom card (count + legend)
 * that sit flush against the map so the three read as one unit.
 *
 * Color by recolors the markers; Narrow by removes them. The star dropdown
 * narrows on whichever dimension Color by is showing — see starDimensionFor()
 * in facilitiesMapMetrics.js, which also decides what the dropdown calls itself.
 */

/* Leaflet closes a tooltip only on its own marker's mouseout, and a pan loses
   that event wholesale: the markers slide under a cursor that never moves, so
   the browser reports them arriving but not leaving. On a dense map one drag
   sweeps dozens past the pointer and every tooltip it opened stays up. Hold the
   map to a single tooltip, and clear it at both ends of any movement — the
   pointer's real position is only meaningful once the map is still again. */
function SingleTooltip() {
  const openTooltip = useRef(null);
  const closeOpen = () => openTooltip.current?.close();

  useMapEvents({
    tooltipopen: (event) => {
      if (openTooltip.current !== event.tooltip) closeOpen();
      openTooltip.current = event.tooltip;
    },
    movestart: closeOpen,
    moveend: closeOpen,
  });

  return null;
}

/* The Leaflet map. Kept flush (rounded-none) so the FlushCards above and below
   form the card's rounded corners. Leaflet needs an explicit height on its
   container, hence the fixed h-80.

   `key={stateName}` is load-bearing: MapContainer reads `bounds` only when it
   creates the Leaflet instance (once, on mount), so changing the prop alone
   would leave the map parked on the previous state. Keying on the state name
   forces a fresh map — and a fresh mount-time fitBounds — whenever it changes. */
function MapPanel({ stateName, viewport, markers, valueLabel }) {
  const navigate = useNavigate();

  return (
    <div className="h-80 w-full overflow-hidden">
      <MapContainer
        key={stateName}
        bounds={viewport.bounds}
        maxBounds={viewport.maxBounds}
        minZoom={viewport.minZoom}
        maxZoom={viewport.maxZoom}
        maxBoundsViscosity={1}
        /* Wheel scroll pans the page; ctrl/⌘ + scroll zooms the map. */
        gestureHandling={true}
        /* Fractional zoom so fitBounds fills the state box exactly instead of
           rounding down a whole level (which read as "zoomed out"). */
        zoomSnap={0}
        /* Deliberately NOT preferCanvas. The canvas renderer sets
           `_leaflet_disable_events` on its canvas, which makes Map._handleDOMEvent
           drop every event over it — including the mouseover that
           leaflet-gesture-handling waits for before re-enabling dragging. The
           canvas covers the whole map, so panning only worked while the cursor
           sat on a marker (the one case Leaflet re-fires through the map). */
        className="map-control-inset h-full w-full rounded-none"
      >
        <SingleTooltip />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={5}
            pathOptions={marker.pathOptions}
            eventHandlers={{
              click: () =>
                marker.slug &&
                navigate(`/nursing-homes/facilities/${marker.slug}`),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <span className="font-semibold">{marker.name}</span>
              {marker.city ? ` · ${marker.city}` : ''}
              <br />
              {valueLabel}: {marker.valueText}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

MapPanel.propTypes = {
  stateName: PropTypes.string.isRequired,
  viewport: PropTypes.shape({
    bounds: PropTypes.array.isRequired,
    maxBounds: PropTypes.array.isRequired,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
  }).isRequired,
  markers: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueLabel: PropTypes.string.isRequired,
};

function ControlLabel({ children }) {
  return (
    <span className="text-label-sm text-core-black shrink-0 font-medium">
      {children}
    </span>
  );
}

ControlLabel.propTypes = { children: PropTypes.node };

/* Legend for a dimension whose swatches are computed rather than fixed (today
   just Financial, whose buckets are the state's own margin quintiles). Shaped to
   sit alongside RatingDistributionLegend, which owns the static star scale. */
function MapLegend({ items }) {
  return (
    <div className="border-border-primary inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-full border px-3 py-1.5">
      {items.map(({ hex, label }) => (
        <span
          key={hex}
          className="text-label-sm text-content-secondary flex items-center gap-1.5"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: hex }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

MapLegend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      hex: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default function FacilitiesMap({
  stateName = 'Virginia',
  facilities = [],
  financial = null,
  loading = false,
  error = null,
}) {
  const [colorBy, setColorBy] = useState(
    COLOR_BY_TABS.find((tab) => tab.name === DEFAULT_COLOR_BY) ??
      COLOR_BY_TABS[0],
  );
  /* Two narrow-by values rather than one: the star levels and the margin bands
     aren't interchangeable, so a "5 Stars" selection can't carry over to
     Financial. Keeping them apart means each is preserved while the other is
     showing, instead of both resetting on every tab switch. */
  const [starRating, setStarRating] = useState('all');
  const [marginBand, setMarginBand] = useState('all');
  const [ownership, setOwnership] = useState(OWNERSHIP_OPTIONS[0].value);

  /* Memoized so toggling the controls (colorBy / narrow-by) doesn't recompute
     the viewport; it only changes when the state does. */
  const viewport = useMemo(() => getStateMapViewport(stateName), [stateName]);

  const isFinancialTab = colorBy.name === 'Financial';
  const starDimension = starDimensionFor(colorBy.name);
  const narrowOptions = useMemo(
    () =>
      isFinancialTab ? MARGIN_OPTIONS : starRatingOptions(starDimension.label),
    [isFinancialTab, starDimension.label],
  );

  const {
    markers,
    shownCount,
    totalCount,
    unmappedCount,
    legend,
    isFinancial,
    financialYear,
    isFallback,
    valueLabel,
  } = useMemo(
    () =>
      buildFacilitiesMap(facilities, {
        colorBy: colorBy.name,
        starRating,
        marginBand,
        ownership,
        financial,
      }),
    [facilities, colorBy.name, starRating, marginBand, ownership, financial],
  );

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Facilities Across {stateName}
      </Heading>

      <FlushCard position="top">
        {/* Color by */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <ControlLabel>Color by</ControlLabel>
          <TabsSelector
            tabsData={COLOR_BY_TABS}
            activeTab={colorBy}
            onTabChange={setColorBy}
            containerClassName="bg-transparent flex-1"
            variant="inline"
          />
        </div>

        {/* Narrow by */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <ControlLabel>Narrow by</ControlLabel>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              aria-label={
                isFinancialTab
                  ? 'Operating margin'
                  : `Star rating (${starDimension.label})`
              }
              value={isFinancialTab ? marginBand : starRating}
              onChange={(e) =>
                (isFinancialTab ? setMarginBand : setStarRating)(e.target.value)
              }
            >
              {narrowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Ownership Type"
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
            >
              {OWNERSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </FlushCard>

      <MapPanel
        stateName={stateName}
        viewport={viewport}
        markers={markers}
        valueLabel={valueLabel}
      />

      <FlushCard position="bottom">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-label-sm text-content-secondary">
            {loading ? (
              'Loading facilities…'
            ) : error ? (
              'Facility locations could not be retrieved.'
            ) : (
              <>
                <span className="text-core-black font-semibold">
                  {shownCount}
                </span>{' '}
                of {totalCount} facilities
                {unmappedCount > 0 && ` · ${unmappedCount} without a location`}
              </>
            )}
          </p>
          {/* The star legend is a fixed 1-5 scale; the financial ramp's buckets
              are computed per state and year, so it renders its own. */}
          {isFinancial ? (
            <MapLegend items={legend} />
          ) : (
            <RatingDistributionLegend />
          )}
        </div>

        {/* Operating margin comes from audited cost reports and runs years
            behind everything else on this page. Say so rather than letting the
            markers imply the margins are current. */}
        {isFinancial && financialYear && (
          <p className="text-paragraph-xs text-content-tertiary mt-2">
            Operating margin: {financialYear}
            {isFallback && ' (most recent year available)'}
          </p>
        )}
      </FlushCard>
    </section>
  );
}

FacilitiesMap.propTypes = {
  stateName: PropTypes.string,
  facilities: PropTypes.arrayOf(PropTypes.object),
  financial: PropTypes.shape({
    year: PropTypes.number,
    isFallback: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};
