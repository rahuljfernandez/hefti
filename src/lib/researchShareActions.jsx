import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { chartCsvEntry, chartPngEntry } from './chartExport';
import {
  copyRichText,
  downloadBlob,
  escapeHtml,
  downloadZip,
  nodeToPngDataUrl,
  stripMarkdown,
} from './shareActions';
import { slugify } from './slugify';
import ResearchBriefDocument from './researchBriefPdf';

/* Reads the real rasterized pixel dimensions of a captured chart PNG. The
   DOM node's own offsetWidth/offsetHeight isn't a reliable proxy for this —
   e.g. a horizontally-scrollable table card captures wider than its visible
   box — so we measure the actual bytes that will be embedded in the PDF. */
function loadImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/* The telescoping widget's "Right panel" category: one PNG paired with one
   CSV per chart, bundled into a single charts.zip. Skips the on-load context
   charts; a chart that never mounted or whose PNG capture fails is skipped
   entirely so the zip never has a CSV without its matching PNG. */
async function exportRightPanel({
  charts,
  chartCardRefs,
  chartToRows,
  contextChartCountRef,
}) {
  const entries = [];
  const startIndex = contextChartCountRef.current;

  for (let i = startIndex; i < charts.length; i++) {
    const node = chartCardRefs.current.get(i);
    if (!node) continue;
    const fallbackName = `chart-${i + 1}`;

    try {
      entries.push(await chartPngEntry(node, charts[i], fallbackName));
    } catch {
      continue;
    }

    entries.push(chartCsvEntry(charts[i], chartToRows, fallbackName));
  }

  if (entries.length === 0) return false;

  return downloadZip(entries, 'charts.zip');
}

/* Copies the whole conversation as rich text, in order, so pasting into a
   report/email keeps headers/bullets/etc. intact instead of dumping raw
   markdown. User turns are escaped into HTML; assistant turns reuse their
   already-rendered markdown HTML. */
function copyLeftPanel({ messages, assistantContentRefs }) {
  const turns = messages
    .filter((m) => !m.isError && m.content.trim().length > 0)
    .map((m) => {
      const label = m.role === 'user' ? 'You' : 'Assistant';
      const html =
        m.role === 'user'
          ? `<p>${escapeHtml(m.content).replace(/\n/g, '<br />')}</p>`
          : (assistantContentRefs.current.get(m.id)?.innerHTML ?? '');
      return { label, html, text: m.content };
    });

  const html = turns
    .map((turn) => `<p><strong>${turn.label}:</strong></p>${turn.html}`)
    .join('');
  const text = turns.map((turn) => `${turn.label}:\n${turn.text}`).join('\n\n');

  return copyRichText(html, text);
}

/* Builds one turn's chart blocks, by index range (stamped onto the assistant
   message as chartStart/chartEnd — see HeftiResearch.jsx's submitPrompt).

   `table` charts are emitted as structured data (type: 'table') and rendered
   natively in the PDF, NOT screenshotted: TableView scrolls horizontally on
   the narrow panel, so html-to-image would clip off-screen columns out of the
   PNG entirely. chartToRows reads the full underlying data instead. Visual
   charts (bar/scatter/etc.) stay as captured PNGs (type: 'image').

   A chart that never mounted or whose capture fails is skipped rather than
   aborting the rest of the turn. */
async function captureTurnCharts({
  chartStart,
  chartEnd,
  charts,
  chartToRows,
  chartCardRefs,
}) {
  const result = [];

  for (let i = chartStart ?? 0; i < (chartEnd ?? 0); i++) {
    const chart = charts[i];
    if (!chart) continue;

    if (chart.chart_type === 'table') {
      const { headers, rows } = chartToRows(chart);
      if (!rows.length) continue;
      result.push({
        type: 'table',
        title: chart.title,
        description: chart.description,
        headers,
        rows,
      });
      continue;
    }

    const node = chartCardRefs.current.get(i);
    if (!node) continue;

    try {
      const dataUrl = await nodeToPngDataUrl(node);
      /* react-pdf's <Image> can mis-measure a base64 image's intrinsic size
         at layout time and squish/distort it to whatever space is left on
         the page instead of properly overflowing — passing the real aspect
         ratio of the rasterized PNG lets the PDF give the image an explicit,
         correct height instead of guessing one. */
      const { width, height } = await loadImageDimensions(dataUrl);
      result.push({ type: 'image', dataUrl, aspectRatio: width / height });
    } catch {
      continue;
    }
  }

  return result;
}

/* "Full session (PDF)" — a branded "Research Brief" covering every turn
   (user prompt + assistant narrative + that turn's charts), in order.
   Pairs each user message with the assistant message immediately after it
   (how submitPrompt always pushes them); a turn whose assistant reply
   errored is skipped entirely, same rule the other two categories use. */
async function exportFullSession({
  messages,
  charts,
  chartToRows,
  chartCardRefs,
  subjectName,
}) {
  const turns = [];

  for (let i = 0; i < messages.length; i++) {
    const userMessage = messages[i];
    if (userMessage.role !== 'user') continue;

    const assistantMessage = messages[i + 1];
    if (
      !assistantMessage ||
      assistantMessage.role !== 'assistant' ||
      assistantMessage.isError ||
      assistantMessage.chartEnd === undefined
    ) {
      continue;
    }

    const turnCharts = await captureTurnCharts({
      chartStart: assistantMessage.chartStart,
      chartEnd: assistantMessage.chartEnd,
      charts,
      chartToRows,
      chartCardRefs,
    });

    turns.push({
      prompt: userMessage.content,
      narrative: stripMarkdown(assistantMessage.content),
      charts: turnCharts,
    });
  }

  if (turns.length === 0) return false;

  const blob = await pdf(
    <ResearchBriefDocument subjectName={subjectName} turns={turns} />,
  ).toBlob();

  const filename = subjectName
    ? `${slugify(subjectName)}-research-brief.pdf`
    : 'research-brief.pdf';

  return downloadBlob(blob, filename);
}

export function createResearchShareActions({
  assistantContentRefs,
  chartCardRefs,
  chartsRef,
  chartToRows,
  contextChartCountRef,
  messages,
  subjectName,
}) {
  return {
    handleExportRightPanel: () =>
      exportRightPanel({
        charts: chartsRef.current,
        chartCardRefs,
        chartToRows,
        contextChartCountRef,
      }),
    handleCopyLeftPanel: () =>
      copyLeftPanel({
        messages,
        assistantContentRefs,
      }),
    handleExportFullSession: () =>
      exportFullSession({
        messages,
        charts: chartsRef.current,
        chartToRows,
        chartCardRefs,
        subjectName,
      }),
  };
}
