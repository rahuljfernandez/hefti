/**
 * State 5-year trends adapter.
 *
 * Purpose:
 * - Normalizes the `trends` block from /state-profile into a display-ready shape
 *   the UI renders without further computation.
 * - Keeps the year axis and the plotted points in one structure so the chart's
 *   column headers and its points can never disagree about which years are
 *   being plotted.
 *
 * The API owns which years the window covers — ratings only go back to 2020, so
 * it slides the window forward rather than returning a two-point series, and
 * flags that with `isClamped`. See stateTrends() in the API's lib/stateProfile.js.
 *
 * Pattern matches the other metric builders in this folder: a builder that
 * returns normalized UI data, and guards that return null rather than a
 * half-built shape when the data can't support a render.
 */

import { RATING_METRICS } from './ratingMetricsConfig';

/**
 * Formats a delta the way the design writes it: signed, one decimal, and no
 * leading zero (+.3 / -.3). A flat series keeps its zero so the cell never
 * renders as a bare sign.
 */
export function formatTrendChange(change) {
  if (!change) return '0.0';
  const sign = change > 0 ? '+' : '-';
  return `${sign}${Math.abs(change).toFixed(1).replace(/^0/, '')}`;
}

/**
 * Normalizes the API's `trends` block into:
 *   { years, isClamped, metrics: [{ key, label, points, change, direction }] }
 *
 * Each point is { year, value }. `change` is last minus first, rounded to one
 * decimal — computed rather than authored so it can't drift from the plotted
 * points. `direction` is 'up' | 'down' | 'flat', which drives the badge color
 * and arrow.
 *
 * Series shorter than two points are dropped: a single point has no trend to
 * show and no change to compute. `years` is narrowed to the years that actually
 * survived, so a metric with a gap can't leave a header column over nothing.
 */
export function buildStateTrends(trends) {
  const years = trends?.years ?? [];
  const series = trends?.series ?? {};
  if (years.length < 2) return null;

  const metrics = RATING_METRICS.map(({ key, label }) => {
    const points = (series[key] ?? [])
      .map((value, i) => ({ year: years[i], value }))
      .filter((point) => point.year != null && point.value != null);
    if (points.length < 2) return null;

    const first = points[0].value;
    const last = points[points.length - 1].value;
    const change = Number((last - first).toFixed(1));

    return {
      key,
      label,
      points,
      change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
    };
  }).filter(Boolean);

  if (metrics.length === 0) return null;

  const plotted = new Set(
    metrics.flatMap((metric) => metric.points.map((point) => point.year)),
  );

  return {
    years: years.filter((year) => plotted.has(year)),
    isClamped: Boolean(trends?.isClamped),
    metrics,
  };
}
