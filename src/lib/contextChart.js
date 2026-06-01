/**
 * Builds the Researcher's on-load "context chart" — a comparison of the subject's
 * four CMS star ratings against the national average — from data fetched straight
 * from the URL (see HEF-85).
 *
 * The facility and owner endpoints expose the same four ratings under different
 * field names, so we normalize both into a single internal shape here and emit a
 * `comparison_bar` chart object consumable by the existing ResearchChart
 * component — no new chart view required.
 *
 * NOTE: the `comparison_bar` output is a baseline. HEF-85's job is the data
 * pipeline (fetch → normalize → render); the designed on-load charts arrive in
 * HEF-83, which will change what this emits and/or add new ResearchChart views.
 * The fetch effect that calls this stays untouched across that work.
 */

// Per-context field names for the four CMS star ratings on the subject record.
const RATING_KEYS = {
  facility: {
    overall: 'overall_rating',
    healthInspection: 'health_inspection_rating',
    staffing: 'staffing_rating',
    quality: 'quality_rating',
  },
  owner: {
    overall: 'cms_owner_average_overall_rating',
    healthInspection: 'cms_owner_average_hi_rating',
    staffing: 'cms_owner_average_staffing_rating',
    quality: 'cms_owner_average_quality_rating',
  },
};

// Field names for the same four ratings on the /national benchmark record.
const NATIONAL_KEYS = {
  overall: 'national_overall_rating',
  healthInspection: 'national_health_inspection_rating',
  staffing: 'national_staffing_rating',
  quality: 'national_quality_rating',
};

// Display order + axis labels, shared by both the subject and national series so
// the bars line up category-for-category.
const METRIC_ORDER = ['overall', 'healthInspection', 'staffing', 'quality'];
const CATEGORY_LABELS = ['Overall', 'Health Inspection', 'Staffing', 'Quality'];

// Star ratings are 1–5; round to one decimal so averaged owner values read cleanly.
function round(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(value * 10) / 10
    : null;
}

/**
 * @param {Object}  args
 * @param {'facility'|'owner'} args.contextType
 * @param {Object}  args.subject       - facility or owner record from the data API
 * @param {Object} [args.national]     - /national benchmark record (optional)
 * @param {string} [args.subjectName]  - display name for the chart title
 * @returns {Object|null} a `comparison_bar` chart object, or null if there's
 *   nothing to plot (unknown context or no subject ratings present).
 */
export function buildContextChart({ contextType, subject, national, subjectName }) {
  const keys = RATING_KEYS[contextType];
  if (!subject || !keys) return null;

  const subjectValues = METRIC_ORDER.map((metric) => round(subject[keys[metric]]));
  // Nothing worth charting if the subject has no ratings at all.
  if (subjectValues.every((value) => value == null)) return null;

  const subjectLabel = contextType === 'owner' ? 'This owner' : 'This facility';
  const series = [{ name: subjectLabel, values: subjectValues }];

  // National bars are best-effort: include them only when the benchmark fetch
  // succeeded and carries usable values, otherwise show the subject alone.
  if (national) {
    const nationalValues = METRIC_ORDER.map((metric) =>
      round(national[NATIONAL_KEYS[metric]]),
    );
    if (nationalValues.some((value) => value != null)) {
      series.push({ name: 'National average', values: nationalValues });
    }
  }

  const comparesNational = series.length > 1;
  return {
    chart_type: 'comparison_bar',
    title: `${subjectName || subjectLabel} — CMS Star Ratings`,
    description: comparesNational
      ? 'Overall, Health Inspection, Staffing, and Quality star ratings (1–5) compared to the national average.'
      : 'Overall, Health Inspection, Staffing, and Quality star ratings (1–5).',
    data: { categories: CATEGORY_LABELS, series },
  };
}
