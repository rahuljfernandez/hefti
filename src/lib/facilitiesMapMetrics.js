/**
 * Facilities-map config and placeholder builder.
 *
 * Purpose:
 * - Holds the static config behind the "Facilities Across Virginia" map module:
 *   the map viewport, the Color-by tabs, and the Narrow-by dropdown options.
 * - Normalizes the (currently invented) facility set into a display-ready shape
 *   the map organism renders without further computation.
 *
 * Pattern matches the other metric builders in this folder (see
 * stateTrendsMetrics.js): config up top, a builder that returns normalized UI
 * data, and a shape the component reads as-is. When the facilities endpoint
 * lands, only the builder below should need to change.
 */

import { STAR_LEVELS } from './ratingDistributionMetrics';

// Re-exported so the map legend reads the same star palette as the rest of the app.
export { STAR_LEVELS };

/* Virginia map viewport. Center/zoom frame the whole state; `bounds` keeps the
   user from panning far off it. Coordinates are [lat, lng] the way Leaflet
   expects. */
export const VA_MAP = {
  center: [37.9, -78.7],
  zoom: 7,
  minZoom: 6,
  maxZoom: 12,
  // [[southWest], [northEast]] — a generous box around Virginia.
  bounds: [
    [36.0, -84.0],
    [39.8, -74.5],
  ],
};

/* Color-by tabs. Shape matches TabsSelector's `tabsData` ({ name }). "Default"
   is the resting state (uniform markers); the rest recolor markers by that
   dimension once facility data lands. "Financial" is operating-margin based. */
export const COLOR_BY_TABS = [
  { name: 'Default' },
  { name: 'Overall' },
  { name: 'Health' },
  { name: 'Staffing' },
  { name: 'Financial' },
];

export const DEFAULT_COLOR_BY = 'Default';

/* Narrow-by: overall star rating. "All" is the default (no narrowing); the rest
   are the 1–5 star levels, derived from STAR_LEVELS so they stay in lockstep
   with the legend. `value` is the star count as a string; 'all' means
   unfiltered. */
export const STAR_RATING_OPTIONS = [
  { value: 'all', label: 'Star Rating' },
  ...STAR_LEVELS.map(({ star }) => ({
    value: String(star),
    label: `${star} ${star === 1 ? 'Star' : 'Stars'}`,
  })),
];

/* Narrow-by: ownership type. Collapsed to the three top-level buckets the CMS
   ownership strings roll up to (see getBadgeColor.js), plus an "All" default. */
export const OWNERSHIP_OPTIONS = [
  { value: 'all', label: 'Ownership Type' },
  { value: 'for_profit', label: 'For Profit' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

/**
 * Normalizes the facility set into:
 *   { facilities: [{ id, lat, lng, ... }], shownCount, totalCount }
 *
 * `facilities` feeds the map markers; `shownCount`/`totalCount` drive the
 * "N of M facilities" caption.
 *
 * PLACEHOLDER DATA — the API does not yet expose per-facility lat/long, the
 * per-metric ratings, or the financial (operating-margin) figure this module
 * needs, so there are no markers to plot and the counts are invented. They are
 * not real and must not be presented as such.
 * TODO: replace with the facilities endpoint once it lands. The organism reads
 * whatever shape this returns; only this builder should need to change.
 */
export function buildFacilitiesMap() {
  return {
    facilities: [],
    shownCount: 82,
    totalCount: 435,
  };
}
