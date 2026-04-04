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

export function buildFacilityCardStats(metricsSource) {
  return facilityCardStatsConfig.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: metricsSource?.[metric.valueKey] ?? 'N/A',
    rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
    isCurrency: metric.isCurrency,
  }));
}
