import React, { useState } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
/* Side-effect import: self-registers the `gestureHandling` map option used
   below. Must come after leaflet so the plugin sees the same L instance. */
import 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import * as Headless from '@headlessui/react';
import FlushCard from '../atom/flushCard';
import { Heading } from '../atom/heading';
import { Switch } from '../atom/switch';
import { buildOwnerFootprint } from '../../../lib/ownerPropertyMetrics';

/**
 * Property Footprint — the second section of the owner Property Details tab.
 *
 * Every owner property with coordinates plotted on one map, over a flush control
 * bar whose toggle repaints the related-party markers amber without hiding the
 * rest. `source` is optional; the builder falls back to mock data until the
 * property API lands.
 */

/* A plain colored dot. Passing a custom className drops Leaflet's default
   `.leaflet-div-icon` white box, so the span is the whole marker. The color
   classes live in template literals here on purpose — Tailwind scans this file,
   so `bg-amber-500`/`bg-content-secondary` are generated even though they never
   appear as a standalone className attribute. */
function dotIcon(colorClass) {
  return L.divIcon({
    className: 'owner-footprint-marker',
    html: `<span class="block size-3.5 rounded-full border-2 border-core-white shadow ${colorClass}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

const NEUTRAL_ICON = dotIcon('bg-content-secondary');
const RELATED_PARTY_ICON = dotIcon('bg-amber-500');

/* Fallback when no property has coordinates — a continental-US view rather than
   an empty frame. */
const US_CENTER = [39.5, -98.35];
const US_ZOOM = 4;

/* Leaflet reads `bounds`/`center` only when it builds the map on mount, so a
   changed `source` (a different owner) would move the markers but leave the map
   parked on the previous viewport. Keying on the bounds forces a fresh mount —
   and a fresh fit — whenever they change. Toggling the highlight only swaps
   marker icons, so it keeps the same key and does not remount. */
function FootprintMapPanel({ markers, bounds, highlight }) {
  const viewProps = bounds
    ? { bounds, boundsOptions: { padding: [48, 48], maxZoom: 12 } }
    : { center: US_CENTER, zoom: US_ZOOM };

  return (
    <div
      className="h-80 w-full overflow-hidden rounded-t-lg"
      role="group"
      aria-label="Map of the owner's properties. Each property and its market value are listed in the Properties section below."
    >
      <MapContainer
        key={bounds ? bounds.join(',') : 'us'}
        {...viewProps}
        /* Wheel scroll pans the page; ctrl/⌘ + scroll zooms the map. */
        gestureHandling={true}
        keyboard={false}
        className="map-control-inset h-full w-full rounded-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={
              highlight && marker.relatedParty
                ? RELATED_PARTY_ICON
                : NEUTRAL_ICON
            }
            keyboard={false}
            alt=""
          >
            <Popup>
              {marker.label}
              {marker.relatedParty && ' · Related party'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

FootprintMapPanel.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      label: PropTypes.string,
      relatedParty: PropTypes.bool,
    }),
  ).isRequired,
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  highlight: PropTypes.bool.isRequired,
};

export default function PropertyFootprint({ source }) {
  const { markers, bounds, relatedPartyCount, totalCount } =
    buildOwnerFootprint(source);
  const [highlight, setHighlight] = useState(false);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Property Footprint
      </Heading>

      <FootprintMapPanel
        markers={markers}
        bounds={bounds}
        highlight={highlight}
      />

      <FlushCard position="bottom">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Field ties the Label to the Switch so clicking the text toggles it. */}
          <Headless.Field className="flex items-center gap-2">
            <Switch checked={highlight} onChange={setHighlight} />
            <Headless.Label className="text-label-sm text-core-black cursor-pointer select-none">
              Highlight related party
            </Headless.Label>
          </Headless.Field>
          <p className="text-label-sm text-content-secondary">
            <span className="text-core-black font-semibold">
              {relatedPartyCount}
            </span>{' '}
            of {totalCount} related party
          </p>
        </div>
      </FlushCard>
    </section>
  );
}

PropertyFootprint.propTypes = {
  source: PropTypes.object,
};
