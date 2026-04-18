import { formatMetricValue, expandStateAbbreviation } from './stringFormatters';
import { getCmprColor } from './getBadgeColor';

/**
 * Clinical quality metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for clinical quality tabs
 * - Keeps facility and owner metric definitions in one place
 * - Transforms raw API fields into the display-ready objects expected by MetricCardLong
 *
 * Pattern:
 * - Config arrays describe which backend fields belong to each metric card
 * - Builder functions read those configs and return normalized UI data
 * - Facility builders include state and national benchmark details
 * - Owner builders return the owner-level values and summary benchmark text
 */

// Facility configs map individual facility fields to long-stay and short-stay cards.
const facilityLongStayConfig = [
  {
    id: 1,
    title: 'Increased need for help with daily activities',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_adl_help_increased',
    comparisonKey: 'cmpr_ls_adl_help_increased',
    stateAvgKey: 'state_ls_adl_help_increased',
    nationalAvgKey: 'national_ls_adl_help_increased',
  },
  {
    id: 2,
    title: 'Received antianxiety or hypnotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_antianxiety_medication',
    comparisonKey: 'cmpr_ls_antianxiety_medication',
    stateAvgKey: 'state_ls_antianxiety_medication',
    nationalAvgKey: 'national_ls_antianxiety_medication',
  },
  {
    id: 3,
    title: 'Antipsychotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_antipsychotic_medication',
    comparisonKey: 'cmpr_ls_antipsychotic_medication',
    stateAvgKey: 'state_ls_antipsychotic_medication',
    nationalAvgKey: 'national_ls_antipsychotic_medication',
  },
  {
    id: 4,
    title: 'Indwelling Catheter',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_catheter',
    comparisonKey: 'cmpr_ls_catheter',
    stateAvgKey: 'state_ls_catheter',
    nationalAvgKey: 'national_ls_catheter',
  },
  {
    id: 5,
    title: 'Depressive symptoms',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_depressive_symptoms',
    comparisonKey: 'cmpr_ls_depressive_symptoms',
    stateAvgKey: 'state_ls_depressive_symptoms',
    nationalAvgKey: 'national_ls_depressive_symptoms',
  },
  {
    id: 6,
    title: 'Falls with major injury',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_falls_major_injury',
    comparisonKey: 'cmpr_ls_falls_major_injury',
    stateAvgKey: 'state_ls_falls_major_injury',
    nationalAvgKey: 'national_ls_falls_major_injury',
  },
  {
    id: 7,
    title: 'New or worsened incontinence',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_incontinence',
    comparisonKey: 'cmpr_ls_incontinence',
    stateAvgKey: 'state_ls_incontinence',
    nationalAvgKey: 'national_ls_incontinence',
  },
  {
    id: 8,
    title: 'Physically restrained',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_physically_restrained',
    comparisonKey: 'cmpr_ls_physically_restrained',
    stateAvgKey: 'state_ls_physically_restrained',
    nationalAvgKey: 'national_ls_physically_restrained',
  },
  {
    id: 9,
    title: 'Received pneumococcal vaccine',
    subtitle: 'Higher percentages are better',
    valueKey: 'ls_pneumococcal_vaccine',
    comparisonKey: 'cmpr_ls_pneumococcal_vaccine',
    stateAvgKey: 'state_ls_pneumococcal_vaccine',
    nationalAvgKey: 'national_ls_pneumococcal_vaccine',
    higherIsBetter: true,
  },
  {
    id: 10,
    title: 'Pressure ulcers',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_pressure_ulcers',
    comparisonKey: 'cmpr_ls_pressure_ulcers',
    stateAvgKey: 'state_ls_pressure_ulcers',
    nationalAvgKey: 'national_ls_pressure_ulcers',
  },
  {
    id: 11,
    title: 'Urinary tract infection',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_uti',
    comparisonKey: 'cmpr_ls_uti',
    stateAvgKey: 'state_ls_uti',
    nationalAvgKey: 'national_ls_uti',
  },
  {
    id: 12,
    title: 'Walking ability worsened',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_walk_worsened',
    comparisonKey: 'cmpr_ls_walk_worsened',
    stateAvgKey: 'state_ls_walk_worsened',
    nationalAvgKey: 'national_ls_walk_worsened',
  },
  {
    id: 13,
    title: 'Significant weight loss',
    subtitle: 'Lower percentages are better',
    valueKey: 'ls_weight_loss',
    comparisonKey: 'cmpr_ls_weight_loss',
    stateAvgKey: 'state_ls_weight_loss',
    nationalAvgKey: 'national_ls_weight_loss',
  },
  {
    id: 14,
    title: 'Outpatient ED visits per 1,000 residents days',
    subtitle: 'Lower rates are better',
    valueKey: 'num_ed_visits_per_1000',
    comparisonKey: 'cmpr_num_ed_visits_per_1000',
    stateAvgKey: 'state_num_ed_visits_per_1000',
    nationalAvgKey: 'national_num_ed_visits_per_1000',
  },
  {
    id: 15,
    title: 'Hospitalizations per 1,000 residents days',
    subtitle: 'Lower rates are better',
    valueKey: 'num_hospitalizations_per_1000',
    comparisonKey: 'cmpr_num_hospitalizations_per_1000',
    stateAvgKey: 'state_num_hospitalizations_per_1000',
    nationalAvgKey: 'national_num_hospitalizations_per_1000',
  },
];

const facilityShortStayConfig = [
  {
    id: 1,
    title: 'Newly received antipsychotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'ss_antipsychotic_medication',
    comparisonKey: 'cmpr_ss_antipsychotic_medication',
    stateAvgKey: 'state_ss_antipsychotic_medication',
    nationalAvgKey: 'national_ss_antipsychotic_medication',
  },
  {
    id: 2,
    title: 'Outpatient ED visits',
    subtitle: 'Lower percentages are better',
    valueKey: 'ss_ed_visit',
    comparisonKey: 'cmpr_ss_ed_visit',
    stateAvgKey: 'state_ss_ed_visit',
    nationalAvgKey: 'national_ss_ed_visit',
  },
  {
    id: 3,
    title: 'Rehospitalized after admission',
    subtitle: 'Lower percentages are better',
    valueKey: 'ss_rehospitalized',
    comparisonKey: 'cmpr_ss_rehospitalized',
    stateAvgKey: 'state_ss_rehospitalized',
    nationalAvgKey: 'national_ss_rehospitalized',
  },
  {
    id: 4,
    title: 'Received pneumococcal vaccine',
    subtitle: 'Higher percentages are better',
    valueKey: 'ss_pneumococcal_vaccine',
    comparisonKey: 'cmpr_ss_pneumococcal_vaccine',
    stateAvgKey: 'state_ss_pneumococcal_vaccine',
    nationalAvgKey: 'national_ss_pneumococcal_vaccine',
  },
];

// Owner configs map owner aggregate fields to the same card shape used by the tab.
// NOTE: medianKey and stdDevKey values are temporary placeholders until owner-level
// benchmark data is available from the backend.
const ownerLongStayConfig = [
  {
    id: 1,
    title: 'Increased need for help with daily activities',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_adl_help_increased',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 2,
    title: 'Received antianxiety or hypnotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_antianxiety_medication',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 3,
    title: 'Antipsychotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_antipsychotic_medication',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 4,
    title: 'Indwelling Catheter',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_catheter',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 5,
    title: 'Depressive symptoms',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_depressive_symptoms',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 6,
    title: 'Falls with major injury',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_falls_major_injury',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 7,
    title: 'New or worsened incontinence',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_incontinence',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 8,
    title: 'Physically restrained',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_physically_restrained',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 9,
    title: 'Received pneumococcal vaccine',
    subtitle: 'Higher percentages are better',
    valueKey: 'cms_owner_avg_ls_pneumococcal_vaccine',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 10,
    title: 'Pressure ulcers',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_pressure_ulcers',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 11,
    title: 'Urinary tract infection',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_uti',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 12,
    title: 'Walking ability worsened',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_walk_worsened',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 13,
    title: 'Significant weight loss',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ls_weight_loss',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 14,
    title: 'Outpatient ED visits per 1,000 residents days',
    subtitle: 'Lower rates are better',
    valueKey: 'cms_owner_avg_ed_visits',
    medianKey: '1.8',
    stdDevKey: '.5',
    isRate: true,
  },
  {
    id: 15,
    title: 'Hospitalizations per 1,000 residents days',
    subtitle: 'Lower rates are better',
    valueKey: 'cms_owner_avg_hospitalizations',
    medianKey: '1.8',
    stdDevKey: '.5',
    isRate: true,
  },
];

const ownerShortStayConfig = [
  {
    id: 1,
    title: 'Newly received antipsychotic medication',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ss_antipsychotic_medication',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 2,
    title: 'Outpatient ED visits',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_ss_ed_visit',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 3,
    title: 'Rehospitalized after admission',
    subtitle: 'Lower percentages are better',
    valueKey: 'cms_owner_avg_rehospitalization',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
  {
    id: 4,
    title: 'Received pneumococcal vaccine',
    subtitle: 'Higher percentages are better',
    valueKey: 'cms_owner_avg_ss_pneumococcal_vaccine',
    medianKey: '1.8',
    stdDevKey: '.5',
  },
];

function appendSuffix(value, suffix) {
  return value === 'N/A' ? value : `${value}${suffix}`;
}

// Facility builders add comparison labels and benchmark details for each metric card.
export function buildFacilityLongStayStats(
  metricsSource,
  nationalBenchmarks,
) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return facilityLongStayConfig.map((metric) => {
    const stateAvg = formatMetricValue(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = formatMetricValue(
      nationalBenchmarks?.[metric.nationalAvgKey],
    );
    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value: formatMetricValue(metricsSource?.[metric.valueKey]),
      comparison: metricsSource?.[metric.comparisonKey],
      comparisonColor: getCmprColor(
        metricsSource?.[metric.comparisonKey],
        metric.higherIsBetter,
      ),
      detail1: `${stateName} average: ${stateAvg}`,
      detail2: `National average: ${nationalAvg}`,
    };
  });
}

export function buildFacilityShortStayStats(
  metricsSource,
  nationalBenchmarks,
) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return facilityShortStayConfig.map((metric) => {
    const stateAvg = formatMetricValue(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = formatMetricValue(
      nationalBenchmarks?.[metric.nationalAvgKey],
    );
    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value: formatMetricValue(metricsSource?.[metric.valueKey]),
      comparison: metricsSource?.[metric.comparisonKey],
      comparisonColor: getCmprColor(
        metricsSource?.[metric.comparisonKey],
        metric.higherIsBetter,
      ),
      detail1: `${stateName} average: ${stateAvg}`,
      detail2: `National average: ${nationalAvg}`,
    };
  });
}

// Owner builders return the same card structure without facility-level comparison badges.
// Placeholder benchmark values from the owner configs are surfaced here as detail text.
export function buildOwnerLongStayStats(metricsSource) {
  return ownerLongStayConfig.map((metric) => {
    const value = formatMetricValue(metricsSource?.[metric.valueKey]);

    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value,
      displayValue: metric.isRate ? value : appendSuffix(value, '%'),
      detail1: `Median: ${metric.medianKey}`,
      detail2: `Std Dev: ${metric.stdDevKey}`,
    };
  });
}

export function buildOwnerShortStayStats(metricsSource) {
  return ownerShortStayConfig.map((metric) => {
    const value = formatMetricValue(metricsSource?.[metric.valueKey]);

    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value,
      displayValue: appendSuffix(value, '%'),
      detail1: `Median: ${metric.medianKey}`,
      detail2: `Std Dev: ${metric.stdDevKey}`,
    };
  });
}
