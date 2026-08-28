/**
 * Facilities-map config and builder.
 *
 * Purpose:
 * - Holds the static config behind the "Facilities Across {State}" map module:
 *   the map viewport, the Color-by tabs, and the Narrow-by dropdown options.
 * - Normalizes a state's facility rows into a display-ready shape the map
 *   organism renders without further computation: colored markers, the counts
 *   behind the caption, and the legend for the active dimension.
 *
 * Pattern matches the other metric builders in this folder (see
 * stateTrendsMetrics.js): config up top, a builder that returns normalized UI
 * data, and a shape the component reads as-is.
 */

import { STAR_LEVELS } from './ratingDistributionMetrics';
import { appendSuffix, formatMetricValue } from './stringFormatters';

// Re-exported so the map legend reads the same star palette as the rest of the app.
export { STAR_LEVELS };

/* Per-state map viewports, keyed by full state name (the shape FacilitiesMap
   receives). Each value is the state's geographic bounding box as
   [[south, west], [north, east]] in Leaflet's [lat, lng] order. The map fits
   this box on load, so center and zoom are derived per state rather than
   hand-tuned. Boxes are approximate — good enough to frame a state. */
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

/* Color-by tabs — re-exported from the shared COLOR_BY_DIMENSIONS so this map and
   the state choropleth recolor by the same five dimensions. "Overall" is the
   default view and "Financial" is operating-margin based. */
export { COLOR_BY_DIMENSIONS as COLOR_BY_TABS } from './ratingMetricsConfig';

export const DEFAULT_COLOR_BY = 'Overall';

/* The facility column behind each Color-by tab. Read by both the marker
   coloring and the star filter, which is what keeps "the star filter narrows
   whatever you're coloring by" true without the two being wired separately. */
const COLOR_BY_COLUMN = {
  Overall: 'overall_rating',
  Health: 'health_inspection_rating',
  Staffing: 'staffing_rating',
  Quality: 'quality_rating',
  Financial: 'operating_margin',
};

const FINANCIAL_TAB = 'Financial';

/* Which dimension the star dropdown narrows on. Operating margin has no star
   levels, so Financial falls back to Overall rather than disabling the control —
   the user's star selection then carries through the tab switch untouched.
   Returns the label too, so the dropdown can name the dimension it is filtering
   and the two can't disagree. */
export function starDimensionFor(colorByName) {
  const label =
    colorByName && colorByName !== FINANCIAL_TAB && COLOR_BY_COLUMN[colorByName]
      ? colorByName
      : 'Overall';
  return { label, column: COLOR_BY_COLUMN[label] };
}

/* Narrow-by: star rating on the active dimension. "All" is the default (no
   narrowing) and names the dimension; the rest are the 1–5 star levels, derived
   from STAR_LEVELS so they stay in lockstep with the legend. `value` is the star
   count as a string; 'all' means unfiltered. */
export function starRatingOptions(dimensionLabel = 'Overall') {
  return [
    { value: 'all', label: `Star Rating (${dimensionLabel})` },
    ...STAR_LEVELS.map(({ star }) => ({
      value: String(star),
      label: `${star} ${star === 1 ? 'Star' : 'Stars'}`,
    })),
  ];
}

/* Narrow-by: ownership type. Collapsed to the three top-level buckets the CMS
   ownership strings roll up to (see getBadgeColor.js), plus an "All" default. */
export const OWNERSHIP_OPTIONS = [
  { value: 'all', label: 'Ownership Type' },
  { value: 'for_profit', label: 'For Profit' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

/* Roll a CMS ownership string up to one of the three OWNERSHIP_OPTIONS buckets.
   The lowercasing is load-bearing, not defensive: `ownership_type` ships
   "FOR PROFIT - CORPORATION" through 2022 and "For profit - Corporation" from
   2023 on, and the state year picker spans both. Matching exact strings — as
   getBadgeColor.js does — silently misses half the range. Note
   `broad_ownership_type` looks like it would do this job but is empty from
   2023 on. */
export function ownershipBucket(ownershipType) {
  const value = String(ownershipType ?? '').toLowerCase();
  if (value.startsWith('for profit') || value.startsWith('for-profit'))
    return 'for_profit';
  if (value.startsWith('government')) return 'government';
  if (value.startsWith('non profit') || value.startsWith('nonprofit'))
    return 'nonprofit';
  return null;
}

/* Marker fills for the four star dimensions, read off STAR_LEVELS so the map and
   RatingDistributionLegend can never drift apart. */
const STAR_HEX = Object.fromEntries(
  STAR_LEVELS.map(({ star, hex }) => [star, hex]),
);

const NO_DATA_HEX = '#cad5e2'; // slate-300

/* Operating margin has no star levels, so Financial gets its own five bands.

   Fixed cut-points rather than each state's own quintiles: margins sit in a very
   different place per state (median -13.7% in RI against -0.5% in CA, measured
   across 2,060 facilities), so relative buckets would make the same color mean
   something different on every state's page and give the Narrow-by dropdown
   options no one can name. Zero is the cut that matters — two thirds of
   facilities are below it.

   Colors reuse the STAR_LEVELS ramp so red always reads as worse and blue as
   better, whichever dimension the map is colored by. `min` is inclusive, `max`
   exclusive, so the bands tile the line with no gap or overlap. */
export const FINANCIAL_BANDS = [
  {
    value: 'under_neg10',
    label: 'Below -10%',
    min: -Infinity,
    max: -10,
    star: 1,
  },
  { value: 'neg10_to_0', label: '-10% to 0%', min: -10, max: 0, star: 2 },
  { value: 'zero_to_5', label: '0% to 5%', min: 0, max: 5, star: 3 },
  { value: 'five_to_10', label: '5% to 10%', min: 5, max: 10, star: 4 },
  { value: 'over_10', label: '10% or more', min: 10, max: Infinity, star: 5 },
  /* Paired by star, not by position: STAR_LEVELS' order is its render order for
     the legend, which is free to change without meaning the ramp reversed. */
].map((band) => ({ ...band, hex: STAR_HEX[band.star] }));

/* Narrow-by when coloring by Financial. Same shape as starRatingOptions so the
   one <Select> can render either. */
export const MARGIN_OPTIONS = [
  { value: 'all', label: 'Operating Margin' },
  ...FINANCIAL_BANDS.map(({ value, label }) => ({ value, label })),
];

const bandFor = (value) =>
  FINANCIAL_BANDS.find((band) => value >= band.min && value < band.max) ?? null;

const bandByValue = new Map(FINANCIAL_BANDS.map((band) => [band.value, band]));

const formatMargin = (value) => appendSuffix(formatMetricValue(value), '%');

/**
 * Normalizes a state's facility rows into what the map renders:
 *   { markers, shownCount, totalCount, unmappedCount, legend, financialYear,
 *     isFallback, marginCoverage, valueLabel }
 *
 * `markers` are only the facilities that pass both Narrow-by filters AND carry
 * coordinates. `shownCount`/`totalCount` drive the "N of M facilities" caption
 * and count facilities, not markers — a facility the API has no coordinates for
 * still exists, so it is counted and reported separately via `unmappedCount`
 * rather than silently vanishing from the total.
 *
 * `legend` is the swatch list for Financial only — the star scale is fixed and
 * RatingDistributionLegend already owns it. `financialYear`, `isFallback`, and
 * `marginCoverage` let the footer disclose that margins are older than the rest
 * of the page and reported by only some of its facilities.
 */
export function buildFacilitiesMap(
  facilities = [],
  {
    colorBy = DEFAULT_COLOR_BY,
    starRating = 'all',
    marginBand = 'all',
    ownership = 'all',
    financial,
  } = {},
) {
  const isFinancial = colorBy === FINANCIAL_TAB;
  const colorColumn = COLOR_BY_COLUMN[colorBy] ?? COLOR_BY_COLUMN.Overall;
  const { column: starColumn } = starDimensionFor(colorBy);

  /* One Narrow-by control, two meanings: star levels for the rating dimensions,
     margin bands for Financial. Only the active one narrows. */
  const star = starRating === 'all' ? null : Number(starRating);
  const band = isFinancial ? (bandByValue.get(marginBand) ?? null) : null;

  const shown = facilities.filter((facility) => {
    if (
      ownership !== 'all' &&
      ownershipBucket(facility?.ownership_type) !== ownership
    )
      return false;
    if (isFinancial) {
      if (!band) return true;
      const margin = facility?.operating_margin;
      return margin != null && margin >= band.min && margin < band.max;
    }
    return star == null || facility?.[starColumn] === star;
  });

  const markers = shown
    .filter((f) => f?.latitude != null && f?.longitude != null)
    .map((facility) => {
      const value = facility[colorColumn] ?? null;
      const color =
        value == null
          ? NO_DATA_HEX
          : isFinancial
            ? (bandFor(value)?.hex ?? NO_DATA_HEX)
            : (STAR_HEX[value] ?? NO_DATA_HEX);

      return {
        id: facility.id,
        slug: facility.slug,
        name: facility.provider_name,
        city: facility.city,
        lat: facility.latitude,
        lng: facility.longitude,
        value,
        valueText:
          value == null
            ? 'No data'
            : isFinancial
              ? formatMargin(value)
              : `${value} ${value === 1 ? 'star' : 'stars'}`,
        /* Built here, not in the component: react-leaflet only re-applies style
           through `pathOptions`, and only when the object's identity changes
           (usePathOptions compares by reference). Building it inside this
           memoized builder means recoloring happens exactly when the color
           actually changes, and a parent re-render alone doesn't call setStyle
           on every marker. */
        pathOptions: {
          color: '#ffffff',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.9,
        },
      };
    });

  return {
    markers,
    shownCount: shown.length,
    totalCount: facilities.length,
    unmappedCount: shown.length - markers.length,
    /* Only Financial needs one built here — the star scale is fixed 1-5 and
       RatingDistributionLegend already owns it. */
    legend: isFinancial
      ? buildFinancialLegend(markers.some((marker) => marker.value == null))
      : null,
    isFinancial,
    financialYear: financial?.year ?? null,
    isFallback: Boolean(financial?.isFallback),
    /* Counted over every facility, not the filtered set: coverage describes the
       margin year itself, and would otherwise read "52 of 52" under a band
       filter that only kept facilities with margins. */
    marginCoverage: isFinancial
      ? facilities.filter((f) => f?.operating_margin != null).length
      : null,
    valueLabel: isFinancial ? 'Operating margin' : `${colorBy} rating`,
  };
}

/* Legend rows for the margin bands — the same config the Narrow-by dropdown and
   the marker colors read, so the three can't disagree. The "No data" row appears
   only when some facility actually renders grey: margin coverage is partial even
   in its own latest year, and an unexplained grey marker is worse than a swatch. */
function buildFinancialLegend(hasNoData) {
  return [
    ...FINANCIAL_BANDS.map(({ hex, label }) => ({ hex, label })),
    ...(hasNoData ? [{ hex: NO_DATA_HEX, label: 'No data' }] : []),
  ];
}
