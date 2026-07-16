/**
 * Projected US-state geometry for the "Explore by State" choropleth.
 *
 * The AlbersUSA projection is static, so the topojson is projected to SVG path
 * strings exactly once here, at module load, and shared by the map component and
 * the data builder. Territories AlbersUSA drops (Puerto Rico, etc.) project to
 * null and are filtered out.
 */

import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import usTopology from 'us-atlas/states-10m.json';

/* Viewport the paths are projected into; the SVG scales fluidly via its viewBox.
   AlbersUSA fits the 50 states + DC into this box (Alaska/Hawaii bottom-left). */
export const VIEW_W = 960;
export const VIEW_H = 600;

/* [{ name, d }] — one entry per rendered state, in topology order. */
export const STATE_PATHS = (() => {
  const collection = feature(usTopology, usTopology.objects.states);
  const projection = geoAlbersUsa().fitSize([VIEW_W, VIEW_H], collection);
  const toPath = geoPath(projection);
  return collection.features
    .map((f) => ({ name: f.properties.name, d: toPath(f) }))
    .filter((s) => Boolean(s.d));
})();

/* The state names AlbersUSA actually renders — the join key the data builder
   assigns buckets over, so the map and its data stay in lockstep. */
export const US_STATE_NAMES = STATE_PATHS.map((s) => s.name);
