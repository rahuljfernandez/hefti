/**
 * Builds the Researcher's on-load context charts from data fetched on mount
 * Returns an array so multiple charts can be seeded at once — currently a KPI grid and a bar chart .
 *
 * The facility and owner endpoints expose the same four CMS ratings under
 * different field names; both are normalized here so callers stay context-agnostic.
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

// Benchmark field names by context:
// - facility: state averages live on the facility record itself
// - owner: national averages from the /national endpoint (owners span states)
const BENCHMARK_KEYS = {
  facility: {
    overall: 'state_overall_rating',
    healthInspection: 'state_health_inspection_rating',
    staffing: 'state_staffing_rating',
    quality: 'state_quality_rating',
  },
  owner: {
    overall: 'national_overall_rating',
    healthInspection: 'national_health_inspection_rating',
    staffing: 'national_staffing_rating',
    quality: 'national_quality_rating',
  },
};

// Source of benchmark data by context — facility reads from the subject record
// itself, owner reads from the separate /national endpoint.
const BENCHMARK_SOURCE = {
  facility: 'subject',
  owner: 'national',
};

const METRICS = [
  { key: 'overall', label: 'Overall Rating', barLabel: 'Overall' },
  { key: 'quality', label: 'Quality', barLabel: 'Quality' },
  { key: 'staffing', label: 'Staffing', barLabel: 'Staffing' },
  {
    key: 'healthInspection',
    label: 'Health Inspection',
    barLabel: 'Health insp.',
  },
];

function round(value) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(value * 10) / 10
    : null;
}

/**
 * @param {Object}  args
 * @param {'facility'|'owner'} args.contextType
 * @param {Object}  args.subject    - facility or owner record from the data API
 * @param {Object} [args.national]  - /national benchmark record (optional)
 * @param {string} [args.subjectName]
 * @returns {Object[]} array of chart objects for ResearchChart: [kpiChart, comparisonChart]
 */
export function buildContextCharts({
  contextType,
  subject,
  national,
  subjectName,
}) {
  const keys = RATING_KEYS[contextType];
  if (!subject || !keys) return [];

  const subjectLabel = contextType === 'owner' ? 'This owner' : 'This facility';
  const benchmarkKeys = BENCHMARK_KEYS[contextType];
  // Facility: state averages are on the subject record. Owner: from /national.
  const benchmarkSource =
    BENCHMARK_SOURCE[contextType] === 'subject' ? subject : national;
  const benchmarkLabel =
    contextType === 'facility' ? 'State avg' : 'National avg';
  const comparisonTitle =
    contextType === 'facility'
      ? 'CMS Star Ratings vs. State Average'
      : 'CMS Star Ratings vs. National Average';

  // Normalize all four metric values once; shared by both charts below.
  const normalized = METRICS.map(({ key, label, barLabel }) => {
    const value = round(subject[keys[key]]);
    const benchmark = benchmarkSource
      ? round(benchmarkSource[benchmarkKeys[key]])
      : null;
    return { key, label, barLabel, value, benchmark };
  });

  const kpis = normalized
    .filter(({ value }) => value != null)
    .map(({ label, value, benchmark }) => ({
      label,
      value: value.toFixed(1),
      ...(benchmark != null ? { delta: `${benchmarkLabel} ${benchmark.toFixed(1)}` } : {}),
    }));

  if (!kpis.length) return [];

  const kpiChart = {
    chart_type: 'kpi_row',
    title: `${subjectName || subjectLabel} — CMS Star Ratings`,
    data: { kpis },
  };

  const subjectValues = normalized.map(({ value }) => value);
  const benchmarkValues = normalized.map(({ benchmark }) => benchmark);
  const hasBenchmark = benchmarkValues.some((v) => v != null);

  const comparisonChart = {
    chart_type: 'comparison_bar',
    title: comparisonTitle,
    data: {
      categories: normalized.map(({ barLabel }) => barLabel),
      series: [
        { name: subjectLabel, values: subjectValues },
        ...(hasBenchmark
          ? [{ name: benchmarkLabel, values: benchmarkValues }]
          : []),
      ],
    },
  };

  return [kpiChart, comparisonChart];
}
