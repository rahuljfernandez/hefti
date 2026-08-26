import { formatDateOnly } from './stringFormatters';

/**
 * Care Compare inspection URLs carry the survey date as `?date=YYYY-MM-DD`.
 */
export function parseInspectionReportDateIso(pdfUrl) {
  if (!pdfUrl) return null;
  const match = String(pdfUrl).match(/[?&]date=(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? null;
}

function displayReportDate(report) {
  if (
    report.report_date &&
    !/^\d{4}-\d{2}-\d{2}$/.test(report.report_date)
  ) {
    return report.report_date;
  }

  const iso =
    report.report_date_iso ||
    (report.report_date && /^\d{4}-\d{2}-\d{2}$/.test(report.report_date)
      ? report.report_date
      : null) ||
    parseInspectionReportDateIso(report.pdf_url || report.report_url);

  if (!iso) return null;
  const formatted = formatDateOnly(iso);
  return formatted && formatted !== 'N/A' ? formatted : null;
}

/** Normalize API inspection_reports rows for DeficiencyReportItem. */
export function mapInspectionReports(reports) {
  if (!Array.isArray(reports)) return [];

  return reports
    .map((report) => {
      const iso =
        report.report_date_iso ||
        (report.report_date && /^\d{4}-\d{2}-\d{2}$/.test(report.report_date)
          ? report.report_date
          : null) ||
        parseInspectionReportDateIso(report.pdf_url || report.report_url);
      return {
        id: report.id,
        report_date: displayReportDate(report),
        report_url: report.report_url || report.pdf_url || null,
        report_date_iso: iso,
      };
    })
    .sort((a, b) => {
      if (a.report_date_iso && b.report_date_iso) {
        return b.report_date_iso.localeCompare(a.report_date_iso);
      }
      if (a.report_date_iso) return -1;
      if (b.report_date_iso) return 1;
      return 0;
    });
}
