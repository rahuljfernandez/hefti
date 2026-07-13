import { rowsToCsv, downloadZip } from '../primitives/shareActions';
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import { toTitleCase } from '../../toTitleCase';
import { ownerRoleMap } from '../../ownerRoleHelper';
import { formatMetricValue, formatUSD } from '../../stringFormatters';
import { buildOwnerCardStats } from '../../providerHighlightsMetrics';
import {
  buildOwnerLongStayStats,
  buildOwnerShortStayStats,
} from '../../clinicalQualityMetrics';
import {
  buildOwnerStaffingLevels,
  buildOwnerStaffingTurnover,
} from '../../staffingMetrics';
import {
  buildOwnerProfitStats,
  buildOwnerRevenueStats,
  buildOwnerExpensesStats,
  buildOwnerLiquidityStats,
} from '../../financialMetrics';
import {
  buildOwnerDeficienciesStats,
  buildOwnerPenaltiesStats,
} from '../../deficienciesMetrics';

/**
 * ownerShareActions
 *
 * Owner-profile export logic, layered on the generic shareActions.js primitives
 * and the shared helpers in profileShareActions.js (copy-link / generic CSV
 * category). Owns the owner-specific data shaping: the associated-facilities CSV,
 * the full owner-statistics CSV (reusing every per-tab owner metric builder), and
 * a ZIP bundling both, plus the "Download all" ShareWidget category. OwnersProfile
 * composes these into its header export set.
 */

/* Owner profile CSV: one row per associated facility. Rows are the
   relatedFacilities the page already derives (facility fields spread with the
   owner's role on that facility). Owner Role uses the same ownerRoleMap label
   as the on-page RelatedFacilities card. */
export const ownerFacilitiesExportConfig = {
  filename: 'related-facilities.csv',
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

/* Flattens every owner statistic into Category / Statistic / Value rows for the
   profile header's "Download CSV". Mirrors buildFacilityStatsRows: it reuses the
   exact per-tab owner metric builders the profile renders from (single source of
   truth for labels + fields), so the CSV never drifts from the on-screen numbers.
   Long format because an owner carries ~35 aggregate metrics — too many for one
   wide row — and the Category column disambiguates labels that repeat across
   sections. Owner builders take only the owner (no nationalBenchmarks); every
   value is an owner-level average across the affiliated facilities. Owners have
   no Additional Information panel, so that facility-only section is omitted. */
export function buildOwnerStatsRows(owner) {
  const rows = [];
  const add = (category, label, value) =>
    rows.push({
      category,
      label,
      value: value == null || value === '' ? 'N/A' : String(value),
    });

  [
    [
      'Average Rating Across All Facilities',
      'cms_owner_average_overall_rating',
    ],
    ['Health Inspection Rating', 'cms_owner_average_hi_rating'],
    ['Staffing Rating', 'cms_owner_average_staffing_rating'],
    ['Quality Measures Rating', 'cms_owner_average_quality_rating'],
  ].forEach(([label, key]) =>
    add('Ratings', label, formatMetricValue(owner?.[key])),
  );

  buildOwnerCardStats(owner).forEach((s) =>
    add('Owner Highlights', s.key, s.isCurrency ? formatUSD(s.stat) : s.stat),
  );

  buildOwnerLongStayStats(owner).forEach((s) =>
    add('Clinical Quality - Long Stay', s.title, s.value),
  );
  buildOwnerShortStayStats(owner).forEach((s) =>
    add('Clinical Quality - Short Stay', s.title, s.value),
  );

  buildOwnerStaffingLevels(owner).forEach((s) =>
    add('Staffing - Levels', s.key, s.displayStat),
  );
  buildOwnerStaffingTurnover(owner).forEach((s) =>
    add('Staffing - Turnover', s.key, s.displayStat),
  );

  buildOwnerProfitStats(owner).forEach((s) =>
    add('Financial - Profitability', s.title, s.value),
  );
  buildOwnerRevenueStats(owner).forEach((s) =>
    add('Financial - Revenue', s.title, s.value),
  );
  buildOwnerExpensesStats(owner).forEach((s) =>
    add('Financial - Expenses', s.title, s.value),
  );
  buildOwnerLiquidityStats(owner).forEach((s) =>
    add('Financial - Liquidity', s.title, s.value),
  );

  [
    ...buildOwnerDeficienciesStats(owner),
    ...buildOwnerPenaltiesStats(owner),
  ].forEach((s) => add('Deficiencies & Penalties', s.key, s.stat));

  return rows;
}

/* Owner profile CSV: all owner statistics (see buildOwnerStatsRows). Rows are the
   {category, label, value} objects that builder returns. */
export const ownerStatsExportConfig = {
  filename: 'owner-statistics.csv',
  tooltip: 'Download all owner statistics as CSV',
  headers: ['Category', 'Statistic', 'Value'],
  toRow: (row) => [row.category, row.label, row.value],
};

/* Bundles the owner's exports into a single ZIP: the statistics CSV and the
   associated-facilities CSV.*/
export async function downloadOwnerZip({ statsRows, facilityRows, filename }) {
  try {
    const entries = [];
    if (statsRows?.length) {
      entries.push({
        name: ownerStatsExportConfig.filename,
        content: rowsToCsv(
          statsRows.map(ownerStatsExportConfig.toRow),
          ownerStatsExportConfig.headers,
        ),
      });
    }
    if (facilityRows?.length) {
      entries.push({
        name: ownerFacilitiesExportConfig.filename,
        content: rowsToCsv(
          facilityRows.map(ownerFacilitiesExportConfig.toRow),
          ownerFacilitiesExportConfig.headers,
        ),
      });
    }
    if (!entries.length) return false;
    return downloadZip(entries, filename);
  } catch {
    return false;
  }
}

/* "Download all" ShareWidget category — the owner ZIP bundle. (Copy-link and the
   plain CSV category are the shared ones in profileShareActions.js.) */
export function ownerZipShareCategory({ statsRows, facilityRows, filename }) {
  return {
    icon: ArchiveBoxArrowDownIcon,
    label: 'Download all',
    tooltip: 'Download owner stats & associated facilities as a ZIP',
    loadingLabel: 'Zipping…',
    successLabel: 'Downloaded',
    emptyLabel: 'No data',
    onClick: () => downloadOwnerZip({ statsRows, facilityRows, filename }),
  };
}
