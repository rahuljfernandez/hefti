/**
 * Config and selectors for the "Explore by State" choropleth section.
 *
 * Purpose:
 * - Holds the static config behind the home-page state map: the Color-by tabs
 *   and the 5-bucket sequential color scale the map and legend both read from.
 * - Selectors that reduce one metric's /state-metrics `states` array into the
 *   display-ready shapes the map renders: `{ [stateName]: bucket }` for fills
 *   and `{ [stateName]: cardItem }` for the hover/tap cards.
 *
 * Pattern matches the other metric modules in this folder (see
 * facilitiesMapMetrics.js): config up top, selectors that return normalized UI
 * data the component reads as-is.
 */

/* Color-by tabs for the choropleth. Shape matches TabsSelector's `tabsData`
   ({ name }). Each dimension recolors the states by that metric's rating. */
export const EXPLORE_BY_STATE_TABS = [
  { name: 'Overall' },
  { name: 'Health' },
  { name: 'Staffing' },
  { name: 'Quality' },
  { name: 'Financial' },
];

export const DEFAULT_STATE_TAB = 'Overall';

/* Sequential 5-bucket scale, light → dark, using slate 200/400/500/700/900.
   Light is the best-rated end, dark is the worst-rated end — the encoding the
   legend labels "Higher-rated → Lower-rated". Both the map fills and the legend
   swatches read this single array so they can never drift apart. Hex values are
   used directly so the SVG `fill` renders without a Tailwind class round-trip. */
export const CHOROPLETH_SCALE = [
  { bucket: 0, hex: '#e2e8f0', token: 'slate-200' },
  { bucket: 1, hex: '#94a3b8', token: 'slate-400' },
  { bucket: 2, hex: '#64748b', token: 'slate-500' },
  { bucket: 3, hex: '#334155', token: 'slate-700' },
  { bucket: 4, hex: '#0f172a', token: 'slate-900' },
];

export const CHOROPLETH_NO_DATA = '#f1f5f9'; // slate-100, for states with no value

/* Map a Color-by tab name to its key in the /api/state-metrics response
   (`metrics.overall`, `metrics.health`, …). The tabs and metric keys line up
   case-insensitively, so the key is just the lowercased tab name. */
export function metricKeyForTab(tabName = DEFAULT_STATE_TAB) {
  return tabName.toLowerCase();
}

/**
 * Reduces one metric's `states` array from /api/state-metrics into the
 * `{ [stateName]: bucketIndex }` shape UsStatesMap fills from. States with a
 * null bucket (no data) are left out, so the map renders them in the no-data
 * color. `stateName` is the join key and must match the map geometry's spelling.
 */
export function statesToBuckets(states = []) {
  const byState = {};
  for (const s of states) {
    if (s?.bucket != null) byState[s.stateName] = s.bucket;
  }
  return byState;
}

/* Resolve a bucket index to its fill hex, falling back to the no-data color. */
export function bucketColor(bucketIndex) {
  return CHOROPLETH_SCALE[bucketIndex]?.hex ?? CHOROPLETH_NO_DATA;
}

/**
 * Builds the per-state hover-card lookup for one metric: a
 * `{ [stateName]: cardItem }` map the map reads on hover for an O(1) lookup (no
 * refetch on tab switch). Each cardItem is display-ready and metric-agnostic —
 * StateMapCard branches only on `format` to decide stars vs. a plain value.
 *
 * `ratingLabel`/`format`/`totalRanked` come from the metric's `meta`; the rest
 * come from the per-state record. `stateName` is the join key with the geometry.
 */
export function buildStateMapCards(metric) {
  if (!metric?.states) return {};
  const { meta, states } = metric;
  const cards = {};
  for (const s of states) {
    if (!s?.stateName) continue;
    cards[s.stateName] = {
      stateName: s.stateName,
      stateCode: s.stateCode,
      facilityCount: s.facilityCount,
      ratingLabel: meta?.valueLabel ?? meta?.label ?? '',
      format: meta?.format ?? 'number',
      value: s.value,
      displayValue: s.displayValue,
      rank: s.rank,
      totalRanked: meta?.totalRanked ?? states.length,
    };
  }
  return cards;
}
