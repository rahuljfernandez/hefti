/**
 * Config and placeholder data for the "Explore by State" choropleth section.
 *
 * Purpose:
 * - Holds the static config behind the home-page state map: the Color-by tabs
 *   and the 5-bucket sequential color scale the map and legend both read from.
 * - Produces a display-ready per-state bucket assignment the map renders without
 *   further computation.
 *
 * Pattern matches the other metric builders in this folder (see
 * facilitiesMapMetrics.js): config up top, a builder that returns normalized UI
 * data, and a shape the component reads as-is. When the state-metrics endpoint
 * lands, only the builder below should need to change.
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

/* Deterministic pseudo-random hash so the placeholder buckets look varied but
   are stable across renders, and differ per tab. Not meaningful data. */
function hashToBucket(stateName, tabName) {
  const seed = `${stateName}|${tabName}`;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % CHOROPLETH_SCALE.length;
}

/**
 * Normalizes state ratings into `{ [stateName]: bucketIndex }` for the active
 * tab. `bucketIndex` (0–4) indexes CHOROPLETH_SCALE.
 *
 * PLACEHOLDER DATA — the API does not yet expose per-state, per-metric ratings,
 * so the buckets are deterministically invented from the state name. They are
 * not real and must not be presented as such.
 * TODO: replace with the state-metrics endpoint once it lands. The map reads
 * whatever shape this returns; only this builder should need to change.
 */
export function buildStateChoropleth(tabName = DEFAULT_STATE_TAB, stateNames = []) {
  const byState = {};
  for (const name of stateNames) {
    byState[name] = hashToBucket(name, tabName);
  }
  return byState;
}

/* Resolve a bucket index to its fill hex, falling back to the no-data color. */
export function bucketColor(bucketIndex) {
  return CHOROPLETH_SCALE[bucketIndex]?.hex ?? CHOROPLETH_NO_DATA;
}
