import { formatMetricValue, expandStateAbbreviation } from './stringFormatters';

/**
 * Staffing metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for staffing tabs
 * - Keeps facility and owner staffing metric definitions in one place
 * - Transforms raw API fields into the display-ready objects expected by StaffingStatCard
 *
 * Pattern:
 * - Config arrays describe which backend fields belong to each staffing card
 * - Builder functions read those configs and return normalized UI data
 * - Facility builders include state benchmark details and comparison labels when available
 * - Owner builders return owner-level values and summary benchmark text
 */

// Facility configs map facility staffing fields to staffing-level and turnover cards.
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
    suffix: '%',
  },
  {
    id: 2,
    title: 'RN Turnover',
    description: 'Total staff turnover for RN',
    valueKey: null,
    ratingKey: null,
    stateAvg: 'N/A',
    suffix: '%',
  },
  {
    id: 3,
    title: 'Administrator Turnover',
    description: 'Total staff turnover for administrative staff',
    valueKey: null,
    ratingKey: null,
    stateAvg: 'N/A',
    suffix: '%',
  },
];

// Owner configs map owner aggregate fields to the same staffing card shape.
// NOTE: owner median values are temporary placeholders, and some owner/facility
// staffing fields remain 'N/A' until backend support is added.
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
    valueKey: null,
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
    suffix: '%',
  },
  {
    id: 2,
    title: 'RN Turnover',
    description: 'Total staff turnover for RN',
    valueKey: null,
    median: '30',
    suffix: '%',
  },
  {
    id: 3,
    title: 'Administrator Turnover',
    description: 'Total staff turnover for administrative staff',
    valueKey: null,
    median: '30',
    suffix: '%',
  },
];

function formatStaffingValue(metric, metricsSource) {
  return metric.valueKey
    ? formatMetricValue(metricsSource?.[metric.valueKey])
    : 'N/A';
}

function formatDisplayValue(metric, value) {
  if (value === 'N/A') return value;
  return metric.suffix ? `${value}${metric.suffix}` : value;
}

// Facility builders add state benchmark details and comparison values for staffing cards.
export function buildFacilityStaffingLevels(metricsSource) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return facilityStaffingLevelsConfig.map((metric) => {
    const stateAvg = formatMetricValue(metricsSource?.[metric.stateAvgKey]);
    const stat = formatStaffingValue(metric, metricsSource);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat,
      displayStat: formatDisplayValue(metric, stat),
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
    const stat = formatStaffingValue(metric, metricsSource);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat,
      displayStat: formatDisplayValue(metric, stat),
      rating: metric.ratingKey ? metricsSource?.[metric.ratingKey] : null,
      detail: stateAvg ? `${stateName} average: ${stateAvg}` : 'N/A',
    };
  });
}

// Owner builders return the same staffing card shape using owner aggregate values.
// Placeholder median values from the owner configs are surfaced here as detail text.
export function buildOwnerStaffingLevels(metricsSource) {
  return ownerStaffingLevelsConfig.map((metric) => {
    const stat = formatStaffingValue(metric, metricsSource);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat,
      displayStat: formatDisplayValue(metric, stat),
      detail: `Median: ${metric.median}`,
    };
  });
}

export function buildOwnerStaffingTurnover(metricsSource) {
  return ownerStaffingTurnoverConfig.map((metric) => {
    const stat = formatStaffingValue(metric, metricsSource);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      stat,
      displayStat: formatDisplayValue(metric, stat),
      detail: `Median: ${metric.median}`,
    };
  });
}
