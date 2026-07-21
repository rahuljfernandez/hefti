import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
/* Side-effect import: self-registers the `gestureHandling` map option used
   below. Must come after leaflet so the plugin sees the same L instance. */
import 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import FlushCard from '../atom/flushCard';
import LayoutCard from '../atom/layout-card';
import FieldGrid from '../molecule/fieldGrid';
import { Heading } from '../atom/heading';
import {
  buildLocationFields,
  buildLocationCoordinates,
} from '../../../lib/propertyMetrics';

/**
 * Location Information — the second section of the Property Details tab.
 *
 * A single-marker map sitting flush on top of a card of address fields, so the
 * two read as one unit. Same flush idiom as facilitiesMap, inverted.
 *
 * Leaflet makes the container and marker keyboard-focusable by default; both
 * are disabled below because every fact the map conveys is also in the FieldGrid
 * beneath it. Re-enabling `keyboard` restores two focus stops that announce
 * nothing useful.
 */

/* Leaflet's default marker resolves icons from a relative path Vite rewrites,
   leaving markers invisible; building the icon from imported asset URLs is the
   standard fix. First Marker in the codebase — move this to a shared module if
   a second map needs it. */
const propertyMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MAP_ZOOM = 16;

/* `key` is load-bearing: MapContainer reads `center` only when it creates the
   Leaflet instance on mount, so changing the prop alone would leave the map
   parked on the previous property.

   role="group" rather than role="img" because the zoom buttons keep their focus
   stops, and an image role must not contain focusable children. */
function PropertyMapPanel({ position, label }) {
  return (
    <div
      className="h-80 w-full overflow-hidden rounded-t-lg"
      role="group"
      aria-label={
        label
          ? `Map showing the location of ${label}. The full address, coordinates, and parcel number are listed below the map.`
          : 'Map showing the property location. The full address, coordinates, and parcel number are listed below the map.'
      }
    >
      <MapContainer
        key={position.join(',')}
        center={position}
        zoom={MAP_ZOOM}
        /* Wheel scroll pans the page; ctrl/⌘ + scroll zooms the map. */
        gestureHandling={true}
        keyboard={false}
        className="map-control-inset h-full w-full rounded-none"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={position}
          icon={propertyMarkerIcon}
          keyboard={false}
          alt=""
        >
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}

PropertyMapPanel.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string,
};

export default function PropertyLocationMap({ source }) {
  const locationFields = buildLocationFields(source);
  const coordinates = buildLocationCoordinates(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Location Information
      </Heading>

      {/* Without coordinates the address fields stand alone as a whole card
          rather than leaving an empty map frame. */}
      {coordinates ? (
        <>
          <PropertyMapPanel
            position={coordinates.position}
            label={coordinates.label}
          />
          <FlushCard position="bottom">
            <FieldGrid fields={locationFields} valueClassName="uppercase" />
          </FlushCard>
        </>
      ) : (
        <LayoutCard>
          <FieldGrid fields={locationFields} valueClassName="uppercase" />
        </LayoutCard>
      )}
    </section>
  );
}

PropertyLocationMap.propTypes = {
  source: PropTypes.object,
};
