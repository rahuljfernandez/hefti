import {
  rowsToCsv,
  downloadZip,
  nodeToPngDataUrl,
  downloadPng,
} from './shareActions';
import { toTitleCase } from '../toTitleCase';
import {
  formatOwnershipPercentage,
  formatMetricValue,
  formatUSD,
} from '../stringFormatters';
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
import { buildAdditionalInformation } from '../additionalInformationFields';
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';

/**
 * facilityShareActions
 *
 * Facility-profile export logic, layered on the generic shareActions.js
 * primitives and the shared helpers in profileShareActions.js (copy-link /
 * generic CSV category). Owns the facility-specific data shaping: the full
 * statistics CSV (reusing every per-tab metric builder), the ownership &
 * stakeholders CSV, the ownership-diagram PNG, and a ZIP bundling all three,
 * plus the "Download all" ShareWidget category. FacilityProfile composes these
 * into its header export set.
 */

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

  buildAdditionalInformation(facility).forEach((f) =>
    add('Additional Information', f.title, f.value),
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

/* Downloads the ownership diagram DOM node as a PNG. Returns false when there's
   no node (a facility with no ownership data renders no diagram). */
export function downloadDiagramPng(node, filename) {
  if (!node) return false;
  return downloadPng(node, filename);
}

/* Bundles the facility's exports into a single ZIP: the statistics CSV, the
   ownership & stakeholders CSV, and a PNG of the ownership diagram. Each part is
   included only when its data/node exists, so a facility with no ownership data
   still yields a stats-only zip. `diagramRef` is a React ref read at click time,
   so the node is resolved when the user exports rather than captured at render. */
export async function downloadFacilityZip({
  statsRows,
  stakeholderRows,
  diagramRef,
  filename,
}) {
  try {
    const entries = [];
    if (statsRows?.length) {
      entries.push({
        name: facilityStatsExportConfig.filename,
        content: rowsToCsv(
          statsRows.map(facilityStatsExportConfig.toRow),
          facilityStatsExportConfig.headers,
        ),
      });
    }
    if (stakeholderRows?.length) {
      entries.push({
        name: facilityStakeholdersExportConfig.filename,
        content: rowsToCsv(
          stakeholderRows.map(facilityStakeholdersExportConfig.toRow),
          facilityStakeholdersExportConfig.headers,
        ),
      });
    }
    /* Capture the diagram in its own try: html-to-image can fail on a given DOM
       (tainted canvas, unloaded fonts, oversized SVG), and that shouldn't sink
       the CSVs already built — degrade to a CSV-only zip rather than nothing. */
    const diagramNode = diagramRef?.current;
    if (diagramNode) {
      try {
        entries.push({
          name: 'ownership-diagram.png',
          content: await nodeToPngDataUrl(diagramNode),
        });
      } catch {
        /* diagram capture failed — ship the zip without the PNG */
      }
    }
    if (!entries.length) return false;
    return downloadZip(entries, filename);
  } catch {
    return false;
  }
}

/* "Download all" ShareWidget category — the facility ZIP bundle. (Copy-link and
   the plain CSV category are the shared ones in profileShareActions.js.) */
export function facilityZipShareCategory({
  statsRows,
  stakeholderRows,
  diagramRef,
  filename,
}) {
  return {
    icon: ArchiveBoxArrowDownIcon,
    label: 'Download all',
    tooltip: 'Download stats, ownership & diagram as a ZIP',
    loadingLabel: 'Zipping…',
    successLabel: 'Downloaded',
    emptyLabel: 'No data',
    onClick: () =>
      downloadFacilityZip({ statsRows, stakeholderRows, diagramRef, filename }),
  };
}
