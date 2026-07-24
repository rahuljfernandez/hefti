/**
 * Config, ranking builder, and stage-1 placeholder data for the home-page
 * "State Rankings" card grid.
 *
 * Mirrors the /api/state-metrics response (hefti-data-api lib/states.js + the
 * /api/state-metrics route) so stage 2 can feed the live payload straight into
 * buildStateRankingCards: each dimension is `{ meta, states[] }`, and each state
 * carries value, displayValue, rank, and bucket. The ranking rule matches the
 * backend exactly — rank 1 = best (highest value), bucket = min(4, floor((rank-1)/10)),
 * 50 states → 10 per bucket (bucket 0 = best/light … 4 = worst/dark).
 */

/* The five "Rank by" dimensions, in choropleth order (matches COLOR_BY_DIMENSIONS
   in ratingMetricsConfig.js). `sort` is the facilities-browse pre-sort field for
   the card link — Quality has no sortable facilities field, so it links state-only.
   `format` drives value display: stars → "X.X avg", percent → "X.X%". */
export const STATE_RANKING_DIMENSIONS = [
  { id: 'overall', name: 'Overall', valueLabel: 'Overall rating', format: 'stars', sort: 'overall_rating' },
  { id: 'health', name: 'Health', valueLabel: 'Health rating', format: 'stars', sort: 'health_inspection_rating' },
  { id: 'staffing', name: 'Staffing', valueLabel: 'Staffing rating', format: 'stars', sort: 'staffing_rating' },
  { id: 'quality', name: 'Quality', valueLabel: 'Quality rating', format: 'stars', sort: null },
  { id: 'financial', name: 'Financial', valueLabel: 'Operating margin', format: 'percent', sort: 'operating_margin' },
];

/* Stage-1 placeholder: `overall` is the per-state average shown in the design
   mockups; the other four metrics are derived from it with a stable per-metric
   jitter so rankings reshuffle between dimensions. Replaced wholesale in stage 2
   by the /api/state-metrics payload. stateName uses the us-atlas spelling (the map
   geometry join key); stateCode is the /facilities and profile route key. */
const PLACEHOLDER_OVERALL = [
  ['Alaska', 'AK', 3.9], ['New Hampshire', 'NH', 3.9], ['Iowa', 'IA', 3.8],
  ['Hawaii', 'HI', 3.8], ['Utah', 'UT', 3.8], ['Idaho', 'ID', 3.7],
  ['Wisconsin', 'WI', 3.7], ['Florida', 'FL', 3.7], ['Minnesota', 'MN', 3.6],
  ['Nebraska', 'NE', 3.6], ['Maine', 'ME', 3.6], ['North Dakota', 'ND', 3.5],
  ['Oregon', 'OR', 3.5], ['Colorado', 'CO', 3.5], ['Arizona', 'AZ', 3.5],
  ['New Jersey', 'NJ', 3.4], ['Ohio', 'OH', 3.4], ['Virginia', 'VA', 3.4],
  ['South Dakota', 'SD', 3.3], ['Montana', 'MT', 3.3], ['Pennsylvania', 'PA', 3.3],
  ['Michigan', 'MI', 3.2], ['Washington', 'WA', 3.2], ['Rhode Island', 'RI', 3.2],
  ['Connecticut', 'CT', 3.1], ['California', 'CA', 3.1], ['Georgia', 'GA', 3.1],
  ['Tennessee', 'TN', 3.0], ['Kentucky', 'KY', 3.0], ['Delaware', 'DE', 3.0],
  ['North Carolina', 'NC', 2.9], ['Indiana', 'IN', 2.9], ['Maryland', 'MD', 2.9],
  ['Missouri', 'MO', 2.8], ['Illinois', 'IL', 2.8], ['Vermont', 'VT', 2.8],
  ['Wyoming', 'WY', 2.7], ['Massachusetts', 'MA', 2.7], ['New York', 'NY', 2.7],
  ['Kansas', 'KS', 2.7], ['Texas', 'TX', 2.6], ['Louisiana', 'LA', 2.6],
  ['Oklahoma', 'OK', 2.6], ['New Mexico', 'NM', 2.5], ['West Virginia', 'WV', 2.5],
  ['Alabama', 'AL', 2.5], ['Arkansas', 'AR', 2.4], ['South Carolina', 'SC', 2.4],
  ['Mississippi', 'MS', 2.4], ['Nevada', 'NV', 2.3],
];

const round1 = (n) => Math.round(n * 10) / 10;
const clampStar = (n) => round1(Math.min(5, Math.max(1, n)));

/* Stable pseudo-random in [-spread, spread] from a string seed, so derived
   placeholder values are deterministic across reloads. */
function jitter(seed, spread) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ((h % 1000) / 1000) * 2 * spread - spread;
}

const RAW_STATE_VALUES = PLACEHOLDER_OVERALL.map(([stateName, stateCode, overall]) => ({
  stateName,
  stateCode,
  overall,
  health: clampStar(overall + jitter(stateName + 'health', 0.6)),
  staffing: clampStar(overall + jitter(stateName + 'staffing', 0.6)),
  quality: clampStar(overall + jitter(stateName + 'quality', 0.6)),
  financial: round1(2 + (overall - 3) * 3 + jitter(stateName + 'financial', 4)),
}));

/* Mirrors the backend's display formatting (formatMetricValue in lib/states.js). */
function formatMetricValue(value, format) {
  if (value == null) return null;
  if (format === 'percent') return `${value.toFixed(1)}%`;
  return value.toFixed(1);
}

/**
 * Builds one dimension's `{ meta, states[] }` from the placeholder values, ranking
 * and bucketing exactly as the backend does. Ties break on state code (the backend
 * also uses facility count, which stage-1 placeholder data lacks). The returned
 * shape matches /api/state-metrics so stage 2 can pass a fetched metric straight to
 * buildStateRankingCards without going through this builder.
 */
export function buildStateRankingMetric(def) {
  const ranked = RAW_STATE_VALUES.map((s) => ({
    stateName: s.stateName,
    stateCode: s.stateCode,
    value: round1(s[def.id]),
  })).sort((a, b) => b.value - a.value || a.stateCode.localeCompare(b.stateCode));

  const states = ranked.map((s, i) => {
    const rank = i + 1;
    return {
      ...s,
      displayValue: formatMetricValue(s.value, def.format),
      rank,
      bucket: Math.min(4, Math.floor((rank - 1) / 10)),
    };
  });

  return {
    meta: {
      id: def.id,
      label: def.name,
      valueLabel: def.valueLabel,
      format: def.format,
      totalRanked: states.length,
    },
    states,
  };
}

function facilitiesLink(stateCode, sortField) {
  const base = `/facilities?state=${stateCode}`;
  return sortField ? `${base}&sortBy=${sortField}&sort=desc` : base;
}

/**
 * Reduces a built (or fetched) metric into display-ready card items for the grid,
 * ordered by rank ascending (`best`) or descending (`worst`). `to` is the
 * facilities pre-filter/pre-sort link; `valueSuffix` is "avg" for star metrics and
 * null for percent. Fill/badge color is derived at render time from `bucket` via
 * bucketColor, so switching Best/Worst never changes a state's color.
 */
export function buildStateRankingCards(metric, def, order = 'best') {
  const items = metric.states.map((s) => ({
    stateName: s.stateName,
    stateCode: s.stateCode,
    rank: s.rank,
    bucket: s.bucket,
    displayValue: s.displayValue,
    valueSuffix: def.format === 'stars' ? 'avg' : null,
    to: facilitiesLink(s.stateCode, def.sort),
  }));
  items.sort((a, b) => (order === 'best' ? a.rank - b.rank : b.rank - a.rank));
  return items;
}
