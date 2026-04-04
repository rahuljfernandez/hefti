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

export function buildFacilityCardStats(metricsSource) {
  return facilityCardStatsConfig.map((metric) => ({
    key: metric.key,
    description: metric.description,
    stat: metricsSource?.[metric.valueKey] ?? 'N/A',
    rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
    isCurrency: metric.isCurrency,
  }));
}
