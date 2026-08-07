/**
 * Projected US-state geometry.
 *
 * STATE_PATHS is the AlbersUSA composite for the "Explore by State" choropleth —
 * the whole country in one static projection, projected to SVG path strings once
 * at module load. STATE_CARD_SHAPES is a separate per-state geometry for the
 * ranking cards: each state gets its own projection centered on itself, so it
 * renders upright and centered rather than canted by AlbersUSA's conic rotation.
 *
 * Territories AlbersUSA drops (Puerto Rico, etc.) project to null and are filtered.
 */

import {
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoCentroid,
  geoPath,
} from 'd3-geo';
import { feature } from 'topojson-client';
import usTopology from 'us-atlas/states-10m.json';

/* Viewport the paths are projected into; the SVG scales fluidly via its viewBox.
   AlbersUSA fits the 50 states + DC into this box (Alaska/Hawaii bottom-left). */
export const VIEW_W = 960;
export const VIEW_H = 600;

const collection = feature(usTopology, usTopology.objects.states);

/* [{ name, d }] — one entry per rendered state, in topology order. */
export const STATE_PATHS = (() => {
  const projection = geoAlbersUsa().fitSize([VIEW_W, VIEW_H], collection);
  const toPath = geoPath(projection);
  return collection.features
    .map((f) => ({ name: f.properties.name, d: toPath(f) }))
    .filter((s) => Boolean(s.d));
})();

/* Square viewBox every card silhouette is projected into, with a small inset so
   the shape never touches the card edge. */
export const CARD_VIEW = 100;
const CARD_PAD = 10;

/* { [name]: d } — each state on its own azimuthal-equal-area projection rotated to
   the state's centroid, so it renders north-up and centered (no conic cant) and
   fills a fixed CARD_VIEW box. Rotating to the centroid also sidesteps Alaska's
   antimeridian seam. */
export const STATE_CARD_SHAPES = (() => {
  const shapes = {};
  for (const f of collection.features) {
    const [lon, lat] = geoCentroid(f);
    const projection = geoAzimuthalEqualArea()
      .rotate([-lon, -lat])
      .fitExtent(
        [
          [CARD_PAD, CARD_PAD],
          [CARD_VIEW - CARD_PAD, CARD_VIEW - CARD_PAD],
        ],
        f,
      );
    const d = geoPath(projection)(f);
    if (d) shapes[f.properties.name] = d;
  }
  return shapes;
})();
