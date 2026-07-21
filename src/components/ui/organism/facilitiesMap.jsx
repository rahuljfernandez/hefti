import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer } from 'react-leaflet';
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
  STAR_RATING_OPTIONS,
  OWNERSHIP_OPTIONS,
  buildFacilitiesMap,
} from '../../../lib/facilitiesMapMetrics';

/**
 * Facilities Across {State}.
 *
 * An interactive Leaflet map that plots every facility in the state, wrapped in
 * a top control card (Color by / Narrow by) and a bottom card (count + star
 * legend) that sit flush against the map so the three read as one unit.
 *
 * This is the UI shell: the base map is live, but the API does not yet expose
 * per-facility lat/long, so there are no markers to plot and the controls hold
 * state without filtering anything. buildFacilitiesMap() is a placeholder — see
 * facilitiesMapMetrics.js. When the endpoint lands, markers render from
 * `facilities` and the controls narrow/recolor them; the layout here is final.
 */

/* The Leaflet map. Kept flush (rounded-none) so the FlushCards above and below
   form the card's rounded corners. Leaflet needs an explicit height on its
   container, hence the fixed h-80.

   `key={stateName}` is load-bearing: MapContainer reads `bounds` only when it
   creates the Leaflet instance (once, on mount), so changing the prop alone
   would leave the map parked on the previous state. Keying on the state name
   forces a fresh map — and a fresh mount-time fitBounds — whenever it changes. */
function MapPanel({ stateName, viewport }) {
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
        className="facilities-map h-full w-full rounded-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* TODO: render facility markers from `facilities` once the API exposes
            per-facility lat/long (colored by the active Color-by dimension). */}
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
};

function ControlLabel({ children }) {
  return (
    <span className="text-label-sm text-core-black shrink-0 font-medium">
      {children}
    </span>
  );
}

ControlLabel.propTypes = { children: PropTypes.node };

export default function FacilitiesMap({ stateName = 'Virginia' }) {
  const [colorBy, setColorBy] = useState(
    COLOR_BY_TABS.find((tab) => tab.name === DEFAULT_COLOR_BY) ??
      COLOR_BY_TABS[0],
  );
  const [starRating, setStarRating] = useState(STAR_RATING_OPTIONS[0].value);
  const [ownership, setOwnership] = useState(OWNERSHIP_OPTIONS[0].value);

  /* Memoized so toggling the controls (colorBy / narrow-by) doesn't recompute
     the viewport; it only changes when the state does. */
  const viewport = useMemo(() => getStateMapViewport(stateName), [stateName]);

  const { shownCount, totalCount } = buildFacilitiesMap();

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
              aria-label="Star Rating"
              value={starRating}
              onChange={(e) => setStarRating(e.target.value)}
            >
              {STAR_RATING_OPTIONS.map((option) => (
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

      <MapPanel stateName={stateName} viewport={viewport} />

      <FlushCard position="bottom">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-label-sm text-content-secondary">
            <span className="text-core-black font-semibold">{shownCount}</span>{' '}
            of {totalCount} facilities
          </p>
          <RatingDistributionLegend />
        </div>
      </FlushCard>
    </section>
  );
}

FacilitiesMap.propTypes = {
  stateName: PropTypes.string,
};
