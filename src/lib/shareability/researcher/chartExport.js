import {
  downloadCsv,
  downloadPng,
  nodeToPngDataUrl,
  rowsToCsv,
} from '../primitives/shareActions';
import { slugify } from '../../slugify';

/**
 * chartExport — chart-specific export helpers, built on the generic
 * shareActions primitives. Two flavors:
 * - chartCsvEntry / chartPngEntry return a { name, content } object for
 *   bundling into the charts.zip export (no download side effect).
 * - downloadChartCsv / downloadChartPng trigger an immediate single-file
 *   download, used by the per-chart inline share buttons.
 * chartFilenameBase derives a safe filename slug shared by all of them.
 */

/* Falls back to a generic name when the title has no a-z0-9 characters for
   slugify to keep (e.g. emoji/symbols-only), so downloads don't become a bare
   ".csv"/".png" with no visible filename. */
export function chartFilenameBase(chart, fallback = 'chart') {
  return slugify(chart.title) || fallback;
}

export function chartCsvEntry(chart, chartToRows, fallbackName) {
  const filenameBase = chartFilenameBase(chart, fallbackName);
  const { headers, rows } = chartToRows(chart);
  return {
    name: `${filenameBase}.csv`,
    content: rowsToCsv(rows, headers),
  };
}

export async function chartPngEntry(node, chart, fallbackName) {
  const filenameBase = chartFilenameBase(chart, fallbackName);
  const dataUrl = await nodeToPngDataUrl(node);
  return {
    name: `${filenameBase}.png`,
    content: dataUrl,
  };
}

export function downloadChartCsv(chart, chartToRows) {
  const { headers, rows } = chartToRows(chart);
  return downloadCsv(rows, `${chartFilenameBase(chart)}.csv`, headers);
}

export function downloadChartPng(node, chart) {
  return downloadPng(node, `${chartFilenameBase(chart)}.png`);
}
