/**
 * Provider highlights metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for provider highlights summary cards
 * - Keeps facility and owner provider-highlight metric definitions in one place
 * - Transforms raw API fields into the display-ready objects used by the provider highlights UI
 *
 * Pattern:
 * - Config arrays describe which backend fields belong to each summary card
 * - Builder functions read those configs and return normalized UI data
 * - Facility builders include comparison labels when the source data provides them
 * - Owner builders return owner-level aggregate values in the same card shape
 */

import { buildNationalComparison } from './getBadgeColor';
import { formatMetricValue, formatUSD } from './stringFormatters';

// Facility configs map facility provider-highlight fields to summary cards.
const facilityCardStatsConfig = [
  {
    key: 'Total Deficiencies',
    description:
      'Average number of serious deficiencies found in the last three years',
    valueKey: 'health_deficiencies',
    ratingKey: 'cmpr_health_deficiencies',
    isCurrency: false,
  },
  {
    key: 'Number of Fines',
    description:
      'Average percentage of nursing staff who stopped working at the facility over a 12-month period',
    valueKey: 'number_of_fines',
    ratingKey: 'cmpr_number_of_fines',
    isCurrency: false,
  },
  {
    key: 'Fines Total',
    description: 'Average total fines against the facility.',
    valueKey: 'total_amount_of_fines_in_usd',
    ratingKey: 'cmpr_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

/* Owner configs are statewide-style aggregates across a group's affiliated
   homes. Like the state response, the owner response carries no cmpr_ strings,
   so each stat is benchmarked against the /national average via nationalAvgKey.
   Every metric here is lower-is-better (fewer deficiencies, penalties, and
   dollars are better). */
const ownerCardStatsConfig = [
  {
    key: 'Average Total Deficiencies',
    description:
      'Average number of serious deficiencies found in affiliated homes in the last three years',
    valueKey: 'cms_owner_average_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
    decimals: 1,
  },
  {
    key: 'Average Number of Penalties',
    description: 'Average number of penalties issued against affiliated homes',
    valueKey: 'cms_owner_average_penalties',
    nationalAvgKey: 'national_total_penalties',
    isCurrency: false,
  },
  {
    key: 'Average Fine',
    description: 'Average total fines against affiliated homes.',
    valueKey: 'cms_owner_average_fines',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

/* State configs mirror the owner shape: statewide averages and aggregate
   wording. Unlike the facility response (which carries cmpr_ state-average
   strings), the state response has none — so each stat is benchmarked against
   the /national average instead, via nationalAvgKey. Every metric here is
   lower-is-better (fewer deficiencies, fines, and dollars are better). */
const stateCardStatsConfig = [
  {
    key: 'Average Deficiencies',
    description:
      'Average number of serious deficiencies found across nursing homes in this state',
    valueKey: 'health_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
    decimals: 1,
  },
  {
    key: 'Average Number of Fines',
    description:
      'Average number of fines issued across nursing homes in this state',
    valueKey: 'number_of_fines',
    nationalAvgKey: 'national_number_of_fines',
    isCurrency: false,
    decimals: 1,
  },
  {
    key: 'Average Fine Amount',
    description: 'Average total fines issued across nursing homes in this state.',
    valueKey: 'total_amount_of_fines_in_usd',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

/* Shared builder for the state and owner cards: both are lower-is-better
   aggregates with no cmpr_ strings, so each stat is benchmarked against the
   national average to derive an Above/Below National Average badge (label +
   color). Mirrors buildStateDeficienciesStats. A card renders badge-less when
   its value or national benchmark is missing. */
function buildBenchmarkedCardStats(config, metricsSource, nationalBenchmarks) {
  return config.map((metric) => {
    const raw = metricsSource?.[metric.valueKey];
    const stat =
      raw == null
        ? 'N/A'
        : metric.decimals != null
          ? raw.toFixed(metric.decimals)
          : raw;

    const rawNational = metric.nationalAvgKey
      ? nationalBenchmarks?.[metric.nationalAvgKey]
      : null;
    const formatNational = metric.isCurrency ? formatUSD : formatMetricValue;
    const nationalAvg = formatNational(rawNational);
    const { comparison, comparisonColor } = buildNationalComparison(
      raw,
      rawNational,
      false,
    );

    return {
      key: metric.key,
      description: metric.description,
      stat,
      isCurrency: metric.isCurrency,
      rating: comparison,
      ratingColor: comparisonColor,
      detail1: nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

export function buildStateCardStats(metricsSource, nationalBenchmarks) {
  return buildBenchmarkedCardStats(
    stateCardStatsConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

export function buildOwnerCardStats(metricsSource, nationalBenchmarks) {
  return buildBenchmarkedCardStats(
    ownerCardStatsConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

// Facility builders return the same summary-card shape with facility comparison labels.
export function buildFacilityCardStats(metricsSource) {
  return facilityCardStatsConfig.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: metricsSource?.[metric.valueKey] ?? 'N/A',
    rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
    isCurrency: metric.isCurrency,
  }));
}
