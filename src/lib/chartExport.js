import {
  downloadCsv,
  downloadPng,
  nodeToPngDataUrl,
  rowsToCsv,
} from './shareActions';
import { slugify } from './slugify';

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
