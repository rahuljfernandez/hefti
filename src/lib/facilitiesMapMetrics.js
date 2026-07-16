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

/* Per-state map viewports, keyed by full state name (the shape FacilitiesMap
   receives). Each value is the state's geographic bounding box as
   [[south, west], [north, east]] in Leaflet's [lat, lng] order. The map fits
   this box on load, so center and zoom are derived per state rather than
   hand-tuned. Boxes are approximate — good enough to frame a state, and the
   only thing this module needs until per-facility lat/long lands. */
const STATE_MAP_BOUNDS = {
  Alabama: [
    [30.14, -88.47],
    [35.01, -84.89],
  ],
  Alaska: [
    [51.2, -170.0],
    [71.4, -129.9],
  ],
  Arizona: [
    [31.33, -114.82],
    [37.0, -109.05],
  ],
  Arkansas: [
    [33.0, -94.62],
    [36.5, -89.64],
  ],
  California: [
    [32.53, -124.41],
    [42.01, -114.13],
  ],
  Colorado: [
    [36.99, -109.06],
    [41.0, -102.04],
  ],
  Connecticut: [
    [40.98, -73.73],
    [42.05, -71.79],
  ],
  Delaware: [
    [38.45, -75.79],
    [39.84, -75.05],
  ],
  'District of Columbia': [
    [38.79, -77.12],
    [39.0, -76.91],
  ],
  Florida: [
    [24.5, -87.63],
    [31.0, -80.03],
  ],
  Georgia: [
    [30.36, -85.61],
    [35.0, -80.84],
  ],
  Hawaii: [
    [18.9, -160.25],
    [22.24, -154.8],
  ],
  Idaho: [
    [42.0, -117.24],
    [49.0, -111.04],
  ],
  Illinois: [
    [36.97, -91.51],
    [42.51, -87.02],
  ],
  Indiana: [
    [37.77, -88.1],
    [41.76, -84.78],
  ],
  Iowa: [
    [40.38, -96.64],
    [43.5, -90.14],
  ],
  Kansas: [
    [36.99, -102.05],
    [40.0, -94.59],
  ],
  Kentucky: [
    [36.5, -89.57],
    [39.15, -81.96],
  ],
  Louisiana: [
    [28.93, -94.04],
    [33.02, -88.82],
  ],
  Maine: [
    [43.06, -71.08],
    [47.46, -66.95],
  ],
  Maryland: [
    [37.91, -79.49],
    [39.72, -75.05],
  ],
  Massachusetts: [
    [41.24, -73.51],
    [42.89, -69.93],
  ],
  Michigan: [
    [41.7, -90.42],
    [48.31, -82.41],
  ],
  Minnesota: [
    [43.5, -97.24],
    [49.38, -89.49],
  ],
  Mississippi: [
    [30.17, -91.66],
    [35.0, -88.1],
  ],
  Missouri: [
    [35.99, -95.77],
    [40.61, -89.1],
  ],
  Montana: [
    [44.36, -116.05],
    [49.0, -104.04],
  ],
  Nebraska: [
    [39.99, -104.05],
    [43.0, -95.31],
  ],
  Nevada: [
    [35.0, -120.01],
    [42.0, -114.04],
  ],
  'New Hampshire': [
    [42.7, -72.56],
    [45.31, -70.7],
  ],
  'New Jersey': [
    [38.93, -75.56],
    [41.36, -73.89],
  ],
  'New Mexico': [
    [31.33, -109.05],
    [37.0, -103.0],
  ],
  'New York': [
    [40.5, -79.76],
    [45.02, -71.86],
  ],
  'North Carolina': [
    [33.84, -84.32],
    [36.59, -75.46],
  ],
  'North Dakota': [
    [45.94, -104.05],
    [49.0, -96.55],
  ],
  Ohio: [
    [38.4, -84.82],
    [42.32, -80.52],
  ],
  Oklahoma: [
    [33.62, -103.0],
    [37.0, -94.43],
  ],
  Oregon: [
    [41.99, -124.57],
    [46.29, -116.46],
  ],
  Pennsylvania: [
    [39.72, -80.52],
    [42.27, -74.69],
  ],
  'Rhode Island': [
    [41.15, -71.86],
    [42.02, -71.12],
  ],
  'South Carolina': [
    [32.03, -83.35],
    [35.22, -78.54],
  ],
  'South Dakota': [
    [42.48, -104.06],
    [45.94, -96.44],
  ],
  Tennessee: [
    [34.98, -90.31],
    [36.68, -81.65],
  ],
  Texas: [
    [25.84, -106.65],
    [36.5, -93.51],
  ],
  Utah: [
    [37.0, -114.05],
    [42.0, -109.04],
  ],
  Vermont: [
    [42.73, -73.44],
    [45.02, -71.46],
  ],
  Virginia: [
    [36.54, -83.68],
    [39.47, -75.24],
  ],
  Washington: [
    [45.54, -124.85],
    [49.0, -116.92],
  ],
  'West Virginia': [
    [37.2, -82.64],
    [40.64, -77.72],
  ],
  Wisconsin: [
    [42.49, -92.89],
    [47.31, -86.81],
  ],
  Wyoming: [
    [41.0, -111.06],
    [45.01, -104.05],
  ],
};

/* Fallback when the state is unknown: a box around the contiguous US, so the
   map still shows something sensible instead of a blank ocean. */
const US_MAP_BOUNDS = [
  [24.5, -124.8],
  [49.4, -66.9],
];

const MAP_ZOOM = { minZoom: 3, maxZoom: 15 };

/* 
  This is the main zoom knob —
   raise it to zoom in further across all states. maxBounds still uses the full
   box, so the user can pan back out to any edge the inset cropped. */
const STATE_FIT_INSET = 0.05;

/* Widen a [[south, west], [north, east]] box by `factor` of its span on each
   side. Used to turn the tight fit-box into a looser maxBounds, so the user can
   nudge just past the state edge but never pan away from it. */
function padBounds([[south, west], [north, east]], factor) {
  const latPad = (north - south) * factor;
  const lngPad = (east - west) * factor;
  return [
    [south - latPad, west - lngPad],
    [north + latPad, east + lngPad],
  ];
}

/* Resolve a full state name to a Leaflet viewport: `bounds` to fit on load,
   a padded `maxBounds` to pen the user in, and the shared zoom limits. */
export function getStateMapViewport(stateName) {
  const box = STATE_MAP_BOUNDS[stateName] ?? US_MAP_BOUNDS;
  return {
    // Inset box to fit on load (zooms in); full box, padded, for maxBounds.
    bounds: padBounds(box, -STATE_FIT_INSET),
    maxBounds: padBounds(box, 0.35),
    ...MAP_ZOOM,
  };
}

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
