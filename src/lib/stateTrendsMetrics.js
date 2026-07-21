/**
 * State 5-year trends config, placeholder data, and adapter.
 *
 * Purpose:
 * - Holds the five-year rating series behind the State Highlights trend chart
 *   and normalizes it into a display-ready shape the UI renders without further
 *   computation.
 * - Owns the year axis so the chart's column headers and its points can never
 *   disagree about which years are being plotted.
 *
 * Pattern matches the other metric builders in this folder: config up top,
 * a builder that returns normalized UI data, and guards that return null rather
 * than a half-built shape when the data can't support a render.
 */

import { RATING_METRICS } from './ratingMetricsConfig';

// The year axis. Index-aligned with every series in TREND_SERIES below.
export const TREND_YEARS = [2022, 2023, 2024, 2025, 2026];

/* PLACEHOLDER DATA — the state-stats endpoint only returns current-year
   ratings, so these series are invented and identical for every state. They are
   not real CMS history and must not be presented as such.
   TODO: replace with per-state history once the API exposes it. Only this
   constant should need to change; the builder and the chart read whatever
   shape lands here. */
const TREND_SERIES = {
  overall: [2.5, 2.6, 2.7, 2.7, 2.8],
  health_inspection: [2.6, 2.7, 2.8, 2.7, 2.8],
  staffing: [2.2, 2.1, 2.0, 1.9, 1.9],
  quality: [3.5, 3.6, 3.7, 3.8, 3.9],
};

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
 * Normalizes the trend series into:
 *   { years, metrics: [{ key, label, points, change, direction }] }
 *
 * Each point is { year, value }. `change` is last minus first, rounded to one
 * decimal — computed rather than authored so it can't drift from the plotted
 * points. `direction` is 'up' | 'down' | 'flat', which drives the badge color
 * and arrow.
 *
 * Series shorter than two points are dropped: a single point has no trend to
 * show and no change to compute.
 */
export function buildStateTrends() {
  const metrics = RATING_METRICS.map(({ key, label }) => {
    const points = (TREND_SERIES[key] ?? [])
      .map((value, i) => ({ year: TREND_YEARS[i], value }))
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

  return { years: TREND_YEARS, metrics };
}
