import { formatMetricValue, expandStateAbbreviation, formatUSD } from './stringFormatters';
import { buildNationalComparison } from './getBadgeColor';

/**
 * Deficiencies & Penalties metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for the Deficiencies & Penalties tab
 * - Transforms raw API fields into the display-ready objects expected by StatsCard
 *
 * Pattern:
 * - Facility builders surface state and national averages as detail1/detail2
 * - Owner builders surface median and std dev as detail1/detail2 (placeholders until backend provides real data)
 */

const facilityDeficienciesConfig = [
  {
    key: 'Total Deficiencies',
    description: 'Total deficiencies found in the past year',
    valueKey: 'health_deficiencies',
    ratingKey: 'cmpr_health_deficiencies',
    stateAvgKey: 'state_health_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
  },
];

const facilityPenaltiesConfig = [
  {
    key: 'Total Penalties',
    description: 'Total number of penalties issued against this facility',
    valueKey: 'total_penalties',
    ratingKey: 'cmpr_total_penalties',
    stateAvgKey: 'state_total_penalties',
    nationalAvgKey: 'national_total_penalties',
    isCurrency: false,
  },
  {
    key: 'Number of Fines',
    description: 'Total fines issued against this facility',
    valueKey: 'number_of_fines',
    ratingKey: 'cmpr_number_of_fines',
    stateAvgKey: 'state_number_of_fines',
    nationalAvgKey: 'national_number_of_fines',
    isCurrency: false,
  },
  {
    key: 'Total Fine Amount',
    description: 'Total dollar amount of all fines issued against this facility',
    valueKey: 'total_amount_of_fines_in_usd',
    ratingKey: 'cmpr_total_amount_of_fines_in_usd',
    stateAvgKey: 'state_total_amount_of_fines_in_usd',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

// NOTE: owner median/std-dev values are placeholders until backend provides
// owner-level deficiency and penalty distribution data.
const ownerDeficienciesConfig = [
  {
    key: 'Average Total Deficiencies',
    description: 'Average number of deficiencies found in affiliated homes in the last three years',
    valueKey: 'cms_owner_average_deficiencies',
    isCurrency: false,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

const ownerPenaltiesConfig = [
  {
    key: 'Average Number of Penalties',
    description: 'Average number of penalties issued against affiliated homes',
    valueKey: 'cms_owner_average_penalties',
    isCurrency: false,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    key: 'Average Fine Amount',
    description: 'Average total fines issued against affiliated homes',
    valueKey: 'cms_owner_average_fines',
    isCurrency: true,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

export function buildFacilityDeficienciesStats(metricsSource, nationalBenchmarks) {
  const stateName = expandStateAbbreviation(metricsSource?.state);
  return facilityDeficienciesConfig.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = format(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = format(nationalBenchmarks?.[metric.nationalAvgKey]);
    return {
      key: metric.key,
      description: metric.description,
      stat: metricsSource?.[metric.valueKey] ?? 'N/A',
      rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
      isCurrency: metric.isCurrency,
      detail1: stateAvg !== 'N/A' ? `${stateName} average: ${stateAvg}` : null,
      detail2: nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

export function buildFacilityPenaltiesStats(metricsSource, nationalBenchmarks) {
  const stateName = expandStateAbbreviation(metricsSource?.state);
  return facilityPenaltiesConfig.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = format(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = format(nationalBenchmarks?.[metric.nationalAvgKey]);
    return {
      key: metric.key,
      description: metric.description,
      stat: metricsSource?.[metric.valueKey] ?? 'N/A',
      rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
      isCurrency: metric.isCurrency,
      detail1: stateAvg !== 'N/A' ? `${stateName} average: ${stateAvg}` : null,
      detail2: nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

function buildOwnerStats(config, metricsSource) {
  const format = (metric, value) =>
    metric.isCurrency ? formatUSD(value) : formatMetricValue(value);

  return config.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: format(metric, metricsSource?.[metric.valueKey]),
    isCurrency: metric.isCurrency,
    detail1: `Median: ${metric.medianKey}`,
    detail2: `Std Dev: ${metric.stdDevKey}`,
  }));
}

export function buildOwnerDeficienciesStats(metricsSource) {
  return buildOwnerStats(ownerDeficienciesConfig, metricsSource);
}

export function buildOwnerPenaltiesStats(metricsSource) {
  return buildOwnerStats(ownerPenaltiesConfig, metricsSource);
}

/* State builders reuse the facility configs but benchmark each value against
   the national average from /national, deriving the Above/Below National
   Average badge like the other tabs. Every deficiency/penalty metric is
   lower-is-better (fewer deficiencies, penalties, fines, and dollars are
   better), so a value below the national average reads green. */
function buildStateStats(config, metricsSource, nationalBenchmarks) {
  return config.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const rawValue = metricsSource?.[metric.valueKey];
    const rawNational = nationalBenchmarks?.[metric.nationalAvgKey];
    const nationalAvg = format(rawNational);
    const { comparison, comparisonColor } = buildNationalComparison(
      rawValue,
      rawNational,
      false,
    );
    return {
      key: metric.key,
      description: metric.description,
      stat: rawValue ?? 'N/A',
      isCurrency: metric.isCurrency,
      rating: comparison,
      ratingColor: comparisonColor,
      detail1: nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

export function buildStateDeficienciesStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(
    facilityDeficienciesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

export function buildStatePenaltiesStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(
    facilityPenaltiesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}
