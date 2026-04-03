import { formatMetricValue, expandStateAbbreviation } from './stringFormatters';

const facilityStaffingLevelsConfig = [
  {
    id: 1,
    title: 'LPN hours/residents/day',
    description: 'Reported total nurse staffing hours per resident per day.',
    valueKey: 'lpn_hprd',
    ratingKey: 'cmpr_lpn_hprd',
    stateAvgKey: 'state_lpn_hprd',
  },
  {
    id: 2,
    title: 'RN Hours/resident/day',
    description:
      'Reported total Registered Nurse staffing hours per resident per day.',
    valueKey: 'rn_hprd',
    ratingKey: 'cmpr_rn_hprd',
    stateAvgKey: 'state_rn_hprd',
  },
  {
    id: 3,
    title: 'Nurse hours/resident/weekend',
    description:
      'Reported total nurse staffing hours per resident on the weekend.',
    valueKey: 'lpn_hprw',
    ratingKey: 'cmpr_lpn_hprw',
    stateAvgKey: 'state_lpn_hprw',
  },
];

const facilityStaffingTurnoverConfig = [
  {
    id: 1,
    title: 'Nursing Staff Turnover',
    description: 'Total staff turnover for nursing staff',
    valueKey: 'nursing_turnover',
    ratingKey: 'cmpr_nursing_turnover',
    stateAvgKey: 'state_nursing_turnover',
  },
  {
    id: 2,
    title: 'RN Turnover',
    description: 'Total staff turnover for RN',
    valueKey: 'N/A',
    ratingKey: 'N/A',
    stateAvg: 'N/A',
  },
  {
    id: 3,
    title: 'Administrator Turnover',
    description: 'Total staff turnover for administrative staff',
    valueKey: 'N/A',
    ratingKey: 'N/A',
    stateAvg: 'N/A',
  },
];

const ownerStaffingLevelsConfig = [
  {
    id: 1,
    title: 'LPN hours/residents/day',
    description: 'Reported total nurse staffing hours per resident per day.',
    valueKey: 'cms_owner_avg_lpn_hprd',
    median: '3',
  },
  {
    id: 2,
    title: 'RN Hours/resident/day',
    description:
      'Reported total Registered Nurse staffing hours per resident per day.',
    valueKey: 'cms_owner_avg_rn_hprd',
    median: '3',
  },
  {
    id: 3,
    title: 'Nurse hours/resident/weekend',
    description:
      'Reported total nurse staffing hours per resident on the weekend.',
    valueKey: 'N/A',
    median: '3',
  },
];

const ownerStaffingTurnoverConfig = [
  {
    id: 1,
    title: 'Nursing Staff Turnover',
    description: 'Total staff turnover for nursing staff',
    valueKey: 'cms_owner_avg_turnover',
    median: '30',
  },
  {
    id: 2,
    title: 'RN Turnover',
    description: 'Total staff turnover for RN',
    valueKey: 'N/A',
    median: '30',
  },
  {
    id: 3,
    title: 'Administrator Turnover',
    description: 'Total staff turnover for administrative staff',
    valueKey: 'N/A',
    median: '30',
  },
];

export function buildFacilityStaffingLevels(metricsSource) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return facilityStaffingLevelsConfig.map((metric) => {
    const stateAvg = formatMetricValue(metricsSource?.[metric.stateAvgKey]);
    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat: metric.valueKey
        ? formatMetricValue(metricsSource?.[metric.valueKey])
        : 'N/A',
      rating: metricsSource?.[metric.ratingKey] ?? null,
      detail: `${stateName} average: ${stateAvg}`,
    };
  });
}

export function buildFacilityStaffingTurnover(metricsSource) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return facilityStaffingTurnoverConfig.map((metric) => {
    const stateAvg = metric.stateAvgKey
      ? formatMetricValue(metricsSource?.[metric.stateAvgKey])
      : metric.stateAvg;
    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat: metric.valueKey
        ? formatMetricValue(metricsSource?.[metric.valueKey])
        : 'N/A',
      rating: metric.ratingKey ? metricsSource?.[metric.ratingKey] : 'N/A',
      detail: stateAvg ? `${stateName} average: ${stateAvg}` : 'N/A',
    };
  });
}

export function buildOwnerStaffingLevels(metricsSource) {
  return ownerStaffingLevelsConfig.map((metric) => ({
    id: metric.id,
    title: metric.title,
    description: metric.description,
    stat: metric.valueKey
      ? formatMetricValue(metricsSource?.[metric.valueKey])
      : 'N/A',
    detail: `Median: ${metric.median}`,
  }));
}

export function buildOwnerStaffingTurnover(metricsSource) {
  return ownerStaffingTurnoverConfig.map((metric) => ({
    id: metric.id,
    title: metric.title,
    description: metric.description,
    stat: metric.valueKey
      ? formatMetricValue(metricsSource?.[metric.valueKey])
      : 'N/A',
    detail: `Median: ${metric.median}`,
  }));
}
