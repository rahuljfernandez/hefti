/**
 * Facility rating distribution config and adapter.
 *
 * Purpose:
 * - Maps the backend `rating_distribution` payload into a display-ready shape
 *   the FacilityRatingDistribution UI can render without further computation.
 * - Owns the star-level color config shared by the bar and the legend so the
 *   two never drift out of sync.
 *
 * The component is subject-agnostic: any response that carries a
 * `rating_distribution` object of this shape (state, owner, etc.) can feed it.
 */

/* Star levels 1-5 with their bar/dot color. Order here is the render order for
   both the stacked bar segments and the legend. */
export const STAR_LEVELS = [
  { star: 1, colorClass: 'bg-red-600' },
  { star: 2, colorClass: 'bg-orange-500' },
  { star: 3, colorClass: 'bg-amber-500' },
  { star: 4, colorClass: 'bg-blue-500' },
  { star: 5, colorClass: 'bg-blue-700' },
];

/* Which metrics render, in order, and their display label. Keys match the
   `rating_distribution` object returned by the API. */
const METRIC_CONFIG = [
  { key: 'overall', label: 'Overall' },
  { key: 'health_inspection', label: 'Health' },
  { key: 'staffing', label: 'Staffing' },
  { key: 'quality', label: 'Quality' },
];

const COLOR_BY_STAR = Object.fromEntries(
  STAR_LEVELS.map(({ star, colorClass }) => [star, colorClass]),
);

/**
 * Normalizes a raw `rating_distribution` object into:
 *   { totalFacilities, metrics: [{ key, label, rated, segments, belowThreePct }] }
 *
 * Each segment is { star, count, pct, colorClass }. `pct` is the raw share of
 * this metric's rated facilities (used for aria labels); bar widths are driven
 * by count so they always fill exactly 100%. `belowThreePct` is the cumulative
 * 1+2 star share (facilities below 3 stars), rounded, or null when the metric
 * has no rated facilities.
 */
export function buildRatingDistribution(distribution) {
  if (!distribution) return null;

  const metrics = METRIC_CONFIG.map(({ key, label }) => {
    const entry = distribution[key];
    const rated = entry?.rated ?? 0;
    const counts = entry?.counts ?? {};

    const segments = STAR_LEVELS.map(({ star }) => {
      const count = counts[star] ?? 0;
      return {
        star,
        count,
        pct: rated > 0 ? (count / rated) * 100 : 0,
        colorClass: COLOR_BY_STAR[star],
      };
    });

    const belowThreeCount = (counts[1] ?? 0) + (counts[2] ?? 0);
    const belowThreePct =
      rated > 0 ? Math.round((belowThreeCount / rated) * 100) : null;

    return { key, label, rated, segments, belowThreePct };
  });

  return {
    totalFacilities: distribution.total_facilities ?? null,
    metrics,
  };
}
