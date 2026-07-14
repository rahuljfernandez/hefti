import { copyText, downloadCsv } from './shareActions';
import { toTitleCase } from '../toTitleCase';
import {
  formatOwnershipPercentage,
  formatMetricValue,
  formatUSD,
} from '../stringFormatters';
import { ownerRoleMap } from '../ownerRoleHelper';
import { buildFacilityCardStats } from '../providerHighlightsMetrics';
import {
  buildFacilityLongStayStats,
  buildFacilityShortStayStats,
} from '../clinicalQualityMetrics';
import {
  buildFacilityStaffingLevels,
  buildFacilityStaffingTurnover,
} from '../staffingMetrics';
import {
  buildFacilityProfitStats,
  buildFacilityRevenueStats,
  buildFacilityExpensesStats,
  buildFacilityLiquidityStats,
} from '../financialMetrics';
import {
  buildFacilityDeficienciesStats,
  buildFacilityPenaltiesStats,
} from '../deficienciesMetrics';

/**
 * profileShareActions
 *
 * Share actions for the facility and owner profile headers. Mirrors how
 * rankingShareActions / researchShareActions sit on the generic shareActions.js
 * primitives: this file owns the profile-specific data shaping (the copy-link
 * action + the CSV column configs); ProfileHeader builds the ShareWidget
 * categories from these.
 *
 * The CSV for each profile is the primary tabular list on that page:
 * - Facility profile -> its ownership & stakeholders
 * - Owner profile    -> its associated facilities
 */

/* Copies a link to the current profile to the clipboard. Reads the live URL so
   the copied link carries whatever slug/route the visitor is actually on. */
export function copyProfileLink() {
  return copyText(window.location.href);
}

/* Writes the supplied rows to CSV via the given config. An optional `filename`
   overrides config.filename (used to name the file after the profile subject).
   Returns false on an empty set so the ShareWidget segment can surface its empty
   state instead of downloading a header-only file. */
export function downloadProfileCsv(rows, config, filename) {
  if (!rows?.length) return false;
  return downloadCsv(
    rows.map(config.toRow),
    filename || config.filename,
    config.headers,
  );
}

/* Facility profile CSV: one row per ownership/stakeholder link
   (facility.facility_ownership_links), matching the on-page
   "Ownership and Stakeholders" list. */
export const facilityStakeholdersExportConfig = {
  filename: 'ownership-stakeholders.csv',
  tooltip: 'Download ownership & stakeholders as CSV',
  headers: ['Owner', 'Ownership Type', 'Role', 'Ownership %'],
  toRow: (link) => [
    toTitleCase(link.ownership_entity?.cms_ownership_name || ''),
    toTitleCase(link.cms_ownership_type || ''),
    toTitleCase(link.cms_ownership_role || ''),
    formatOwnershipPercentage(link.cms_ownership_percentage),
  ],
};

/* Owner profile CSV: one row per associated facility. Rows are the
   relatedFacilities the page already derives (facility fields spread with the
   owner's role on that facility). Owner Role uses the same ownerRoleMap label
   as the on-page RelatedFacilities card. */
export const ownerFacilitiesExportConfig = {
  filename: 'associated-facilities.csv',
  tooltip: 'Download associated facilities as CSV',
  headers: ['Name', 'Address', 'City', 'State', 'CMS Rating', 'Owner Role'],
  toRow: (facility) => [
    toTitleCase(facility.provider_name || ''),
    toTitleCase(facility.street_address || ''),
    toTitleCase(facility.city || ''),
    facility.state || '',
    facility.overall_rating ?? '',
    ownerRoleMap[facility.cms_ownership_role]?.label ??
      toTitleCase(facility.cms_ownership_role || ''),
  ],
};

/* Flattens every facility statistic into Category / Statistic / Value rows for
   the profile header's "Download CSV". Reuses the exact per-tab metric builders
   the profile renders from (single source of truth for labels + fields), so the
   CSV never drifts from the on-screen numbers. Long format because one facility
   has ~40 metrics — too many for a single wide row — and the Category column
   disambiguates labels that repeat across sections (e.g. pneumococcal vaccine
   appears in both long- and short-stay). `nationalBenchmarks` is accepted only
   because the builders take it; only each metric's own value is exported. */
export function buildFacilityStatsRows(facility, nationalBenchmarks) {
  const rows = [];
  const add = (category, label, value) =>
    rows.push({
      category,
      label,
      value: value == null || value === '' ? 'N/A' : String(value),
    });

  [
    ['Overall Star Rating', 'overall_rating'],
    ['Health Inspection Rating', 'health_inspection_rating'],
    ['Staffing Rating', 'staffing_rating'],
    ['Quality Measures Rating', 'quality_rating'],
  ].forEach(([label, key]) =>
    add('Ratings', label, formatMetricValue(facility?.[key])),
  );

  buildFacilityCardStats(facility).forEach((s) =>
    add('Provider Highlights', s.key, s.isCurrency ? formatUSD(s.stat) : s.stat),
  );

  buildFacilityLongStayStats(facility, nationalBenchmarks).forEach((s) =>
    add('Clinical Quality - Long Stay', s.title, s.value),
  );
  buildFacilityShortStayStats(facility, nationalBenchmarks).forEach((s) =>
    add('Clinical Quality - Short Stay', s.title, s.value),
  );

  buildFacilityStaffingLevels(facility).forEach((s) =>
    add('Staffing - Levels', s.key, s.displayStat),
  );
  buildFacilityStaffingTurnover(facility).forEach((s) =>
    add('Staffing - Turnover', s.key, s.displayStat),
  );

  buildFacilityProfitStats(facility, nationalBenchmarks).forEach((s) =>
    add('Financial - Profitability', s.title, s.value),
  );
  buildFacilityRevenueStats(facility, nationalBenchmarks).forEach((s) =>
    add('Financial - Revenue', s.title, s.value),
  );
  buildFacilityExpensesStats(facility, nationalBenchmarks).forEach((s) =>
    add('Financial - Expenses', s.title, s.value),
  );
  buildFacilityLiquidityStats(facility, nationalBenchmarks).forEach((s) =>
    add('Financial - Liquidity', s.title, s.value),
  );

  [
    ...buildFacilityDeficienciesStats(facility, nationalBenchmarks),
    ...buildFacilityPenaltiesStats(facility, nationalBenchmarks),
  ].forEach((s) =>
    add(
      'Deficiencies & Penalties',
      s.key,
      s.isCurrency ? formatUSD(s.stat) : formatMetricValue(s.stat),
    ),
  );

  return rows;
}

/* Facility profile CSV: all facility statistics (see buildFacilityStatsRows).
   Rows are the {category, label, value} objects that builder returns. */
export const facilityStatsExportConfig = {
  filename: 'facility-statistics.csv',
  tooltip: 'Download all facility statistics as CSV',
  headers: ['Category', 'Statistic', 'Value'],
  toRow: (row) => [row.category, row.label, row.value],
};
