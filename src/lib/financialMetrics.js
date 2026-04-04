import {
  formatMetricValue,
  expandStateAbbreviation,
  formatUSD,
} from './stringFormatters';
import { getCmprColor } from './getBadgeColor';

/**
 * Financial metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for financial overview tabs
 * - Keeps facility and owner financial metric definitions in one place
 * - Transforms raw API fields into the display-ready objects expected by MetricCardLong
 *
 * Pattern:
 * - Config arrays describe which backend fields belong to each financial card
 * - Shared builder helpers read those configs and return normalized UI data
 * - Facility builders include state and national benchmark details
 * - Owner builders return owner-level values and summary benchmark text
 */

// Facility configs map facility financial fields to profit, revenue, expense, and liquidity cards.
const facilityProfitConfig = [
  {
    id: 1,
    title: 'Operating Margin',
    subtitle:
      'The percentage of revenue left after operating costs. Higher values suggest better financial health',
    valueKey: 'operating_margin',
    comparisonKey: 'cmpr_operating_margin',
    stateAvgKey: 'state_operating_margin',
    nationalAvgKey: 'national_operating_margin',
  },
  {
    id: 2,
    title: 'Total Margin',
    subtitle:
      'Overall profitability after all expenses. Higher values indicate better performance',
    valueKey: 'total_margin',
    comparisonKey: 'cmpr_total_margin',
    stateAvgKey: 'state_total_margin',
    nationalAvgKey: 'national_total_margin',
  },
  {
    id: 3,
    title: 'Net Income',
    subtitle:
      'Total profit remaining after all revenues and expenses. Positive values indicate the facility is financially solvent.',
    valueKey: 'net_income',
    comparisonKey: 'cmpr_net_income',
    stateAvgKey: 'state_net_income',
    nationalAvgKey: 'national_net_income',
    isCurrency: true,
  },
];

const facilityRevenueConfig = [
  {
    id: 1,
    title: 'Net Patient Services Revenue',
    subtitle:
      'Total revenue earned from patient care services. Higher values reflect greater care volume and billing.',
    valueKey: 'net_patient_services_revenue',
    comparisonKey: 'cmpr_net_patient_services_revenue',
    stateAvgKey: 'state_net_patient_services_revenue',
    nationalAvgKey: 'national_net_patient_services_revenue',
    isCurrency: true,
  },
];

const facilityExpensesConfig = [
  {
    id: 1,
    title: 'Operating Expenses',
    subtitle:
      'Total costs incurred in running day-to-day facility operations. Higher values relative to revenue may indicate financial strain.',
    valueKey: 'operating_expenses',
    comparisonKey: 'cmpr_operating_expenses',
    stateAvgKey: 'state_operating_expenses',
    nationalAvgKey: 'national_operating_expenses',
    isCurrency: true,
  },
  {
    id: 2,
    title: 'Total Salaries',
    subtitle:
      'Total compensation paid to all facility staff. A major component of operating expenses in nursing homes.',
    valueKey: 'total_salaries',
    comparisonKey: 'cmpr_total_salaries',
    stateAvgKey: 'state_total_salaries',
    nationalAvgKey: 'national_total_salaries',
    isCurrency: true,
  },
  {
    id: 3,
    title: 'Total Expenses',
    subtitle:
      'The sum of all costs incurred by the facility. Comparing to revenue indicates overall financial sustainability.',
    valueKey: 'total_expenses',
    comparisonKey: 'cmpr_total_expenses',
    stateAvgKey: 'state_total_expenses',
    nationalAvgKey: 'national_total_expenses',
    isCurrency: true,
  },
  {
    id: 4,
    title: 'Related Party to Total Operating Expenses',
    subtitle:
      'Share of total operating expenses paid to affiliated companies. Higher values may indicate reduced financial transparency.',
    valueKey: 'related_party_to_total_op_expenses',
    comparisonKey: 'cmpr_related_party_to_total_op_expenses',
    stateAvgKey: 'state_related_party_to_total_op_expenses',
    nationalAvgKey: 'national_related_party_to_total_op_expenses',
  },
  {
    id: 5,
    title: 'Related Party to Net Operating Expenses',
    subtitle:
      'Share of net operating expenses paid to affiliated companies. Higher values may indicate conflicts of interest.',
    valueKey: 'related_party_to_net_op_expenses',
    comparisonKey: 'cmpr_related_party_to_net_op_expenses',
    stateAvgKey: 'state_related_party_to_net_op_expenses',
    nationalAvgKey: 'national_related_party_to_net_op_expenses',
  },
];

const facilityLiquidityConfig = [
  {
    id: 1,
    title: 'Current Ratio',
    subtitle:
      'Measures ability to cover short-term debts. Higher values suggest stronger short term financial stability',
    valueKey: 'current_ratio',
    comparisonKey: 'cmpr_current_ratio',
    stateAvgKey: 'state_current_ratio',
    nationalAvgKey: 'national_current_ratio',
  },
  {
    id: 2,
    title: 'Long Term Debt to Capital Ratio',
    subtitle:
      'Shows reliance on debt for capital improvements. Lower values indicate more sustainable investment strategies.',
    valueKey: 'long_term_debt_to_capital_ratio',
    comparisonKey: 'cmpr_long_term_debt_to_capital_ratio',
    stateAvgKey: 'state_long_term_debt_to_capital_ratio',
    nationalAvgKey: 'national_long_term_debt_to_capital_ratio',
  },
];

// Shared facility builder applies formatting and benchmark lookups to each configured metric.
function buildStats(config, metricsSource, national) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return config.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = metric.stateAvgKey
      ? format(metricsSource?.[metric.stateAvgKey])
      : 'N/A';
    const nationalAvg = metric.nationalAvgKey
      ? format(national?.[metric.nationalAvgKey])
      : 'N/A';
    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value: metric.valueKey ? format(metricsSource?.[metric.valueKey]) : 'N/A',
      comparison: metric.comparisonKey
        ? metricsSource?.[metric.comparisonKey]
        : null,
      comparisonColor: metric.comparisonKey
        ? getCmprColor(metricsSource?.[metric.comparisonKey])
        : null,
      detail1: `${stateName} average: ${stateAvg}`,
      detail2: `National average: ${nationalAvg}`,
    };
  });
}

export function buildFacilityProfitStats(metricsSource, national) {
  return buildStats(facilityProfitConfig, metricsSource, national);
}

export function buildFacilityRevenueStats(metricsSource, national) {
  return buildStats(facilityRevenueConfig, metricsSource, national);
}

export function buildFacilityExpensesStats(metricsSource, national) {
  return buildStats(facilityExpensesConfig, metricsSource, national);
}

export function buildFacilityLiquidityStats(metricsSource, national) {
  return buildStats(facilityLiquidityConfig, metricsSource, national);
}

// Owner configs map owner aggregate fields to the same long-form financial card shape.
// NOTE: owner median/std-dev values are placeholders for now. 'N/A' is used until
// benchmark data is available or the metric is not yet supplied by the backend.

const ownerProfitConfig = [
  {
    id: 1,
    title: 'Operating Margin',
    subtitle:
      'The percentage of revenue left after operating costs. Higher values suggest better financial health',
    valueKey: 'cms_owner_avg_operating_margin',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    id: 2,
    title: 'Total Margin',
    subtitle:
      'Overall profitability after all expenses. Higher values indicate better performance',
    valueKey: 'cms_owner_avg_total_margin',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    id: 3,
    title: 'Net Income',
    subtitle:
      'Total profit remaining after all revenues and expenses. Positive values indicate the facility is financially solvent.',
    valueKey: 'cms_owner_total_income',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    isCurrency: true,
  },
];

const ownerRevenueConfig = [
  {
    id: 1,
    title: 'Net Patient Services Revenue',
    subtitle:
      'Total revenue earned from patient care services. Higher values reflect greater care volume and billing.',
    valueKey: 'cms_owner_total_revenue',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    isCurrency: true,
  },
];

const ownerExpensesConfig = [
  {
    id: 1,
    title: 'Operating Expenses',
    subtitle:
      'Total costs incurred in running day-to-day facility operations. Higher values relative to revenue may indicate financial strain.',
    valueKey: 'null',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    isCurrency: true,
  },
  {
    id: 2,
    title: 'Total Salaries',
    subtitle:
      'Total compensation paid to all facility staff. A major component of operating expenses in nursing homes.',
    valueKey: 'cms_owner_total_salaries',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    isCurrency: true,
  },
  {
    id: 3,
    title: 'Total Expenses',
    subtitle:
      'The sum of all costs incurred by the facility. Comparing to revenue indicates overall financial sustainability.',
    valueKey: 'cms_owner_total_expenses',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    isCurrency: true,
  },
  {
    id: 4,
    title: 'Related Party to Total Operating Expenses',
    subtitle:
      'Share of total operating expenses paid to affiliated companies. Higher values may indicate reduced financial transparency.',
    valueKey: 'cms_owner_avg_related_to_total_exp',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    id: 5,
    title: 'Related Party to Net Operating Expenses',
    subtitle:
      'Share of net operating expenses paid to affiliated companies. Higher values may indicate conflicts of interest.',
    valueKey: 'cms_owner_avg_related_to_net_exp',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

const ownerLiquidityConfig = [
  {
    id: 1,
    title: 'Current Ratio',
    subtitle:
      'Measures ability to cover short-term debts. Higher values suggest stronger short term financial stability',
    valueKey: 'cms_owner_avg_current_ratio',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    id: 2,
    title: 'Long Term Debt to Capital Ratio',
    subtitle:
      'Shows reliance on debt for capital improvements. Lower values indicate more sustainable investment strategies.',
    valueKey: 'cms_owner_avg_ltdtc',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

// Shared owner builder formats owner aggregate values and attaches summary benchmark text.
// Any placeholder benchmark values defined in the owner configs are rendered as-is.
function buildOwnerStats(config, metricsSource) {
  const format = (metric, value) =>
    metric.isCurrency ? formatUSD(value) : formatMetricValue(value);

  return config.map((metric) => ({
    id: metric.id,
    title: metric.title,
    subtitle: metric.subtitle,
    value: metric.valueKey
      ? format(metric, metricsSource?.[metric.valueKey])
      : 'N/A',
    detail1: `Median: ${metric.medianKey}`,
    detail2: `Std Dev: ${metric.stdDevKey}`,
  }));
}

export function buildOwnerProfitStats(metricsSource) {
  return buildOwnerStats(ownerProfitConfig, metricsSource);
}

export function buildOwnerRevenueStats(metricsSource) {
  return buildOwnerStats(ownerRevenueConfig, metricsSource);
}

export function buildOwnerExpensesStats(metricsSource) {
  return buildOwnerStats(ownerExpensesConfig, metricsSource);
}

export function buildOwnerLiquidityStats(metricsSource) {
  return buildOwnerStats(ownerLiquidityConfig, metricsSource);
}
