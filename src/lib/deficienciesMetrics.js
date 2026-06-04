/**
 * Deficiencies & Penalties metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for the Deficiencies & Penalties tab
 * - Transforms raw API fields into the display-ready objects expected by StatsCard
 *
 * Pattern:
 * - Config arrays describe which backend fields map to each stat card
 * - Builder functions read those configs and return normalized UI data
 * - Facility builders include CMS comparison ratings when available
 */

const facilityDeficienciesConfig = [
  {
    key: 'Total Deficiencies',
    description: 'Number of deficiencies found during health inspections in the last three years',
    valueKey: 'health_deficiencies',
    ratingKey: 'cmpr_health_deficiencies',
    isCurrency: false,
  },
];

const facilityPenaltiesConfig = [
  {
    key: 'Number of Fines',
    description: 'Total number of fines issued against this facility',
    valueKey: 'number_of_fines',
    ratingKey: 'cmpr_number_of_fines',
    isCurrency: false,
  },
  {
    key: 'Total Fine Amount',
    description: 'Total dollar amount of all fines issued against this facility',
    valueKey: 'total_amount_of_fines_in_usd',
    ratingKey: 'cmpr_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

const ownerDeficienciesConfig = [
  {
    key: 'Average Total Deficiencies',
    description: 'Average number of deficiencies found in affiliated homes in the last three years',
    valueKey: 'cms_owner_average_deficiencies',
    isCurrency: false,
    decimals: 1,
  },
];

const ownerPenaltiesConfig = [
  {
    key: 'Average Number of Penalties',
    description: 'Average number of penalties issued against affiliated homes',
    valueKey: 'cms_owner_average_penalties',
    isCurrency: false,
  },
  {
    key: 'Average Fine Amount',
    description: 'Average total fines issued against affiliated homes',
    valueKey: 'cms_owner_average_fines',
    isCurrency: true,
  },
];

export function buildFacilityDeficienciesStats(metricsSource) {
  return facilityDeficienciesConfig.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: metricsSource?.[metric.valueKey] ?? 'N/A',
    rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
    isCurrency: metric.isCurrency,
  }));
}

export function buildFacilityPenaltiesStats(metricsSource) {
  return facilityPenaltiesConfig.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: metricsSource?.[metric.valueKey] ?? 'N/A',
    rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
    isCurrency: metric.isCurrency,
  }));
}

export function buildOwnerDeficienciesStats(metricsSource) {
  return ownerDeficienciesConfig.map((metric) => {
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

export function buildOwnerPenaltiesStats(metricsSource) {
  return ownerPenaltiesConfig.map((metric) => {
    const raw = metricsSource?.[metric.valueKey];
    const stat = raw == null ? 'N/A' : raw;
    return {
      key: metric.key,
      description: metric.description,
      stat,
      isCurrency: metric.isCurrency,
    };
  });
}
