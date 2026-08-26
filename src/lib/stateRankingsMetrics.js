/**
 * Config and selectors for the home-page "State Rankings" card grid.
 *
 * Consumes the /api/state-metrics response (hefti-data-api lib/states.js + the
 * /api/state-metrics route): each dimension is `{ meta, states[] }`, and each
 * state carries value, displayValue, rank, and bucket. The backend already ranks
 * and buckets (rank 1 = best/highest value, bucket = min(4, floor((rank-1)/10)),
 * 50 states → 10 per bucket, bucket 0 = best/light … 4 = worst/dark), so this
 * module only maps that payload into display-ready card items.
 */

/* The five "Rank by" dimensions, in choropleth order (matches COLOR_BY_DIMENSIONS
   in ratingMetricsConfig.js and the metric keys in the /api/state-metrics payload).
   `sort` is the facilities-browse pre-sort field for the card link — Quality has no
   sortable facilities field, so it links state-only. Value formatting comes from the
   payload's meta.format, not from here. */
export const STATE_RANKING_DIMENSIONS = [
  { id: 'overall', name: 'Overall', sort: 'overall_rating' },
  { id: 'health', name: 'Health', sort: 'health_inspection_rating' },
  { id: 'staffing', name: 'Staffing', sort: 'staffing_rating' },
  { id: 'quality', name: 'Quality', sort: null },
  { id: 'financial', name: 'Financial', sort: 'operating_margin' },
];

function facilitiesLink(stateCode, sortField) {
  const base = `/nursing-homes/facilities?state=${stateCode}`;
  return sortField ? `${base}&sortBy=${sortField}&sort=desc` : base;
}

/**
 * Reduces a fetched /api/state-metrics metric (`{ meta, states[] }`) into
 * display-ready card items for the grid, ordered by rank ascending (`best`) or
 * descending (`worst`). `to` is the facilities pre-filter/pre-sort link;
 * `valueSuffix` is "avg" for star metrics and "op margin" for percent. States with no
 * rank/bucket (no data) are skipped. Fill/badge color is derived at render time
 * from `bucket` via bucketColor, so switching Best/Worst never changes a state's
 * color.
 */
export function buildStateRankingCards(metric, def, order = 'best') {
  if (!metric?.states) return [];
  const items = metric.states
    .filter((s) => s.rank != null && s.bucket != null)
    .map((s) => ({
      stateName: s.stateName,
      stateCode: s.stateCode,
      rank: s.rank,
      bucket: s.bucket,
      displayValue: s.displayValue,
      valueSuffix: metric.meta?.format === 'stars' ? 'avg' : 'op margin',
      to: facilitiesLink(s.stateCode, def.sort),
    }));
  items.sort((a, b) => (order === 'best' ? a.rank - b.rank : b.rank - a.rank));
  return items;
}
