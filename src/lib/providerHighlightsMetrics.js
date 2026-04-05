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

const ownerCardStatsConfig = [
  {
    key: 'Average Total Deficiencies',
    description:
      'Average number of serious deficiencies found in affiliated homes in the last three years',
    valueKey: 'cms_owner_average_deficiencies',
    isCurrency: false,
    decimals: 1,
  },
  {
    key: 'Average Number of Penalties',
    description:
      'Average percentage of nursing staff who stopped working at affiliated homes over a 12-month period',
    valueKey: 'cms_owner_average_penalties',
    isCurrency: false,
  },
  {
    key: 'Average Fine',
    description: 'Average total fines against affiliated homes.',
    valueKey: 'cms_owner_average_fines',
    isCurrency: true,
  },
];

// Owner builders return a normalized summary-card shape from owner aggregate values.
export function buildOwnerCardStats(metricsSource) {
  return ownerCardStatsConfig.map((metric) => {
    const raw = metricsSource?.[metric.valueKey];
    const stat =
      raw == null
        ? 'N/A'
        : metric.decimals != null
          ? raw.toFixed(metric.decimals)
          : raw;
    return {
      key: metric.key,
      description: metric.description,
      stat,
      isCurrency: metric.isCurrency,
    };
  });
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
