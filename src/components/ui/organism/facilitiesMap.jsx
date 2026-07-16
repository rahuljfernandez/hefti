import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FlushCard from '../atom/flushCard';
import TabsSelector from '../molecule/tabsSelector';
import { Select } from '../atom/select';
import { Heading } from '../atom/heading';
import {
  VA_MAP,
  COLOR_BY_TABS,
  DEFAULT_COLOR_BY,
  NARROW_BY_RATING_OPTIONS,
  OWNERSHIP_OPTIONS,
  STAR_LEVELS,
  buildFacilitiesMap,
} from '../../../lib/facilitiesMapMetrics';

/**
 * Facilities Across Virginia.
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
   container, hence the fixed h-80. */
function MapPanel() {
  return (
    <div className="h-80 w-full overflow-hidden">
      <MapContainer
        center={VA_MAP.center}
        zoom={VA_MAP.zoom}
        minZoom={VA_MAP.minZoom}
        maxZoom={VA_MAP.maxZoom}
        maxBounds={VA_MAP.bounds}
        maxBoundsViscosity={1}
        scrollWheelZoom={false}
        className="h-full w-full rounded-none"
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
    COLOR_BY_TABS.find((tab) => tab.name === DEFAULT_COLOR_BY) ?? COLOR_BY_TABS[0],
  );
  const [ratingMetric, setRatingMetric] = useState(
    NARROW_BY_RATING_OPTIONS[0].value,
  );
  const [ownership, setOwnership] = useState(OWNERSHIP_OPTIONS[0].value);

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
          />
        </div>

        {/* Narrow by */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <ControlLabel>Narrow by</ControlLabel>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              aria-label="Rating Metric"
              value={ratingMetric}
              onChange={(e) => setRatingMetric(e.target.value)}
            >
              {NARROW_BY_RATING_OPTIONS.map((option) => (
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

      <MapPanel />

      <FlushCard position="bottom">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-label-sm text-content-secondary">
            <span className="text-core-black font-semibold">{shownCount}</span> of{' '}
            {totalCount} facilities
          </p>

          {/* Star legend — reuses the shared STAR_LEVELS palette so it matches
              the rating distribution legend elsewhere on the page. */}
          <div className="border-border-primary inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-full border px-3 py-1.5">
            {STAR_LEVELS.map(({ star, colorClass }) => (
              <span
                key={star}
                className="text-label-sm text-content-secondary flex items-center gap-1.5"
              >
                <span className={clsx('h-2.5 w-2.5 rounded-full', colorClass)} />
                {star}★
              </span>
            ))}
          </div>
        </div>
      </FlushCard>
    </section>
  );
}

FacilitiesMap.propTypes = {
  stateName: PropTypes.string,
};
