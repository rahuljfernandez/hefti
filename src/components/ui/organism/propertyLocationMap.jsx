import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
/* Side-effect import: leaflet-gesture-handling self-registers its `gestureHandling`
   handler on Leaflet's Map (enabled via the map option below) and brings its
   overlay styles. Imported after leaflet so the plugin sees the same L instance. */
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
 * two read as one unit. Same flush idiom as facilitiesMap, inverted: there the
 * controls sit above the map, here the map is the top of the card.
 *
 * The map is pointer-only by configuration, not by nature: Leaflet makes both
 * the container and the marker keyboard-focusable by default, and both are
 * disabled below. That is deliberate — every fact the map conveys (address,
 * county, lat/long, parcel) is also in the FieldGrid beneath it, so the
 * information already has a keyboard and screen-reader path. Re-enabling
 * `keyboard` would put back two focus stops that announce nothing useful.
 */

/* Leaflet's default marker resolves its icons from a relative path that Vite's
   bundler rewrites, leaving markers invisible. Building the icon from imported
   asset URLs is the standard fix — Vite hashes them and hands back real URLs.
   This is the first Marker in the codebase, so the fix lives here; move it to a
   shared module if a second map ever needs it. */
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

/* Rounded on top only, so the FlushCard below closes the shape. Leaflet needs an
   explicit height on its container, hence the fixed h-80.

   `key` is load-bearing: MapContainer reads `center` only when it creates the
   Leaflet instance (once, on mount), so changing the prop alone would leave the
   map parked on the previous property. Keying on the coordinates forces a fresh
   map whenever they change.

   The zoom buttons keep their focus stops on purpose — Leaflet labels them
   properly and they're useful to a sighted keyboard user, which is also why
   this is role="group" rather than role="img": an image role must not contain
   focusable children. */
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

      {/* Without coordinates there's nothing to plot, so the address fields
          stand alone as a whole card rather than leaving an empty map frame. */}
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
