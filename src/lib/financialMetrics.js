import {
  formatMetricValue,
  expandStateAbbreviation,
  formatUSD,
} from './stringFormatters';
import { getCmprColor, buildNationalComparison } from './getBadgeColor';

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
function buildStats(config, metricsSource, nationalBenchmarks) {
  const stateName = expandStateAbbreviation(metricsSource?.state);

  return config.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = metric.stateAvgKey
      ? format(metricsSource?.[metric.stateAvgKey])
      : 'N/A';
    const nationalAvg = metric.nationalAvgKey
      ? format(nationalBenchmarks?.[metric.nationalAvgKey])
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

export function buildFacilityProfitStats(metricsSource, nationalBenchmarks) {
  return buildStats(facilityProfitConfig, metricsSource, nationalBenchmarks);
}

export function buildFacilityRevenueStats(metricsSource, nationalBenchmarks) {
  return buildStats(facilityRevenueConfig, metricsSource, nationalBenchmarks);
}

export function buildFacilityExpensesStats(metricsSource, nationalBenchmarks) {
  return buildStats(facilityExpensesConfig, metricsSource, nationalBenchmarks);
}

export function buildFacilityLiquidityStats(metricsSource, nationalBenchmarks) {
  return buildStats(facilityLiquidityConfig, metricsSource, nationalBenchmarks);
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
    suffix: '%',
  },
  {
    id: 2,
    title: 'Total Margin',
    subtitle:
      'Overall profitability after all expenses. Higher values indicate better performance',
    valueKey: 'cms_owner_avg_total_margin',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    suffix: '%',
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
    valueKey: null,
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
    suffix: '%',
  },
  {
    id: 5,
    title: 'Related Party to Net Operating Expenses',
    subtitle:
      'Share of net operating expenses paid to affiliated companies. Higher values may indicate conflicts of interest.',
    valueKey: 'cms_owner_avg_related_to_net_exp',
    medianKey: 'N/A',
    stdDevKey: 'N/A',
    suffix: '%',
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

  const formatDisplayValue = (metric, value) => {
    if (value === 'N/A') return value;
    return metric.suffix ? `${value}${metric.suffix}` : value;
  };

  return config.map((metric) => {
    const value = metric.valueKey
      ? format(metric, metricsSource?.[metric.valueKey])
      : 'N/A';

    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value,
      displayValue: formatDisplayValue(metric, value),
      detail1: `Median: ${metric.medianKey}`,
      detail2: `Std Dev: ${metric.stdDevKey}`,
    };
  });
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

/* State financial configs mirror the facility benchmark keys but reword copy
   for a statewide view — values are averages across the state's nursing homes,
   not a single provider's figures — and carry their own direction/suffix.
   Revenue, margins, net income, and current ratio are higher-is-better;
   expenses, salaries, related-party shares, and the debt ratio are
   lower-is-better, so a state below the national expense average shows green. */
const stateProfitConfig = [
  {
    id: 1,
    title: 'Operating Margin',
    subtitle:
      'The percentage of revenue left after operating costs. Higher values suggest better financial health',
    valueKey: 'operating_margin',
    nationalAvgKey: 'national_operating_margin',
    higherIsBetter: true,
    suffix: '%',
  },
  {
    id: 2,
    title: 'Total Margin',
    subtitle:
      'Overall profitability after all expenses. Higher values indicate better performance',
    valueKey: 'total_margin',
    nationalAvgKey: 'national_total_margin',
    higherIsBetter: true,
    suffix: '%',
  },
  {
    id: 3,
    title: 'Net Income',
    subtitle:
      'Average profit remaining after all revenues and expenses. Positive values indicate financial solvency.',
    valueKey: 'net_income',
    nationalAvgKey: 'national_net_income',
    isCurrency: true,
    higherIsBetter: true,
  },
];

const stateRevenueConfig = [
  {
    id: 1,
    title: 'Net Patient Services Revenue',
    subtitle:
      'Average revenue earned from patient care services. Higher values reflect greater care volume and billing.',
    valueKey: 'net_patient_services_revenue',
    nationalAvgKey: 'national_net_patient_services_revenue',
    isCurrency: true,
    higherIsBetter: true,
  },
];

const stateExpensesConfig = [
  {
    id: 1,
    title: 'Operating Expenses',
    subtitle:
      'Average costs of running day-to-day nursing home operations. Higher values relative to revenue may indicate financial strain.',
    valueKey: 'operating_expenses',
    nationalAvgKey: 'national_operating_expenses',
    isCurrency: true,
    higherIsBetter: false,
  },
  {
    id: 2,
    title: 'Total Salaries',
    subtitle:
      'Average compensation paid to nursing home staff. A major component of operating expenses in nursing homes.',
    valueKey: 'total_salaries',
    nationalAvgKey: 'national_total_salaries',
    isCurrency: true,
    higherIsBetter: false,
  },
  {
    id: 3,
    title: 'Total Expenses',
    subtitle:
      'Average of all costs incurred by nursing homes. Comparing to revenue indicates overall financial sustainability.',
    valueKey: 'total_expenses',
    nationalAvgKey: 'national_total_expenses',
    isCurrency: true,
    higherIsBetter: false,
  },
  {
    id: 4,
    title: 'Related Party to Total Operating Expenses',
    subtitle:
      'Share of total operating expenses paid to affiliated companies. Higher values may indicate reduced financial transparency.',
    valueKey: 'related_party_to_total_op_expenses',
    nationalAvgKey: 'national_related_party_to_total_op_expenses',
    higherIsBetter: false,
    suffix: '%',
  },
  {
    id: 5,
    title: 'Related Party to Net Operating Expenses',
    subtitle:
      'Share of net operating expenses paid to affiliated companies. Higher values may indicate conflicts of interest.',
    valueKey: 'related_party_to_net_op_expenses',
    nationalAvgKey: 'national_related_party_to_net_op_expenses',
    higherIsBetter: false,
    suffix: '%',
  },
];

const stateLiquidityConfig = [
  {
    id: 1,
    title: 'Current Ratio',
    subtitle:
      'Measures ability to cover short-term debts. Higher values suggest stronger short term financial stability',
    valueKey: 'current_ratio',
    nationalAvgKey: 'national_current_ratio',
    higherIsBetter: true,
  },
  {
    id: 2,
    title: 'Long Term Debt to Capital Ratio',
    subtitle:
      'Shows reliance on debt for capital improvements. Lower values indicate more sustainable investment strategies.',
    valueKey: 'long_term_debt_to_capital_ratio',
    nationalAvgKey: 'national_long_term_debt_to_capital_ratio',
    higherIsBetter: false,
  },
];

// State builder benchmarks each value against the national average and derives
// the Above/Below National Average badge, like the clinical and staffing tabs.
function buildStateStats(config, metricsSource, nationalBenchmarks) {
  return config.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const rawValue = metric.valueKey ? metricsSource?.[metric.valueKey] : null;
    const rawNational = metric.nationalAvgKey
      ? nationalBenchmarks?.[metric.nationalAvgKey]
      : null;
    const withSuffix = (formatted) =>
      formatted === 'N/A' || !metric.suffix
        ? formatted
        : `${formatted}${metric.suffix}`;

    const { comparison, comparisonColor } = metric.nationalAvgKey
      ? buildNationalComparison(rawValue, rawNational, metric.higherIsBetter)
      : { comparison: null, comparisonColor: null };

    return {
      id: metric.id,
      title: metric.title,
      subtitle: metric.subtitle,
      value: metric.valueKey ? withSuffix(format(rawValue)) : 'N/A',
      comparison,
      comparisonColor,
      detail1: metric.nationalAvgKey
        ? `National average: ${withSuffix(format(rawNational))}`
        : undefined,
    };
  });
}

export function buildStateProfitStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(stateProfitConfig, metricsSource, nationalBenchmarks);
}

export function buildStateRevenueStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(stateRevenueConfig, metricsSource, nationalBenchmarks);
}

export function buildStateExpensesStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(stateExpensesConfig, metricsSource, nationalBenchmarks);
}

export function buildStateLiquidityStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(stateLiquidityConfig, metricsSource, nationalBenchmarks);
}
