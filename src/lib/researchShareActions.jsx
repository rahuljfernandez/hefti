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

/* Captures one turn's charts as PNGs, by index range (stamped onto the
   assistant message as chartStart/chartEnd — see HeftiResearch.jsx's
   submitPrompt). A chart that never mounted or whose capture fails is
   skipped rather than aborting the rest of the turn. */
async function captureTurnCharts({ chartStart, chartEnd, chartCardRefs }) {
  const result = [];

  for (let i = chartStart ?? 0; i < (chartEnd ?? 0); i++) {
    const node = chartCardRefs.current.get(i);
    if (!node) continue;

    try {
      const dataUrl = await nodeToPngDataUrl(node);
      result.push({ dataUrl });
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
async function exportFullSession({ messages, charts, chartCardRefs, subjectName }) {
  const turns = [];

  for (let i = 0; i < messages.length; i++) {
    const userMessage = messages[i];
    if (userMessage.role !== 'user') continue;

    const assistantMessage = messages[i + 1];
    if (
      !assistantMessage ||
      assistantMessage.role !== 'assistant' ||
      assistantMessage.isError
    ) {
      continue;
    }

    const turnCharts = await captureTurnCharts({
      chartStart: assistantMessage.chartStart,
      chartEnd: assistantMessage.chartEnd,
      charts,
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
  charts,
  chartToRows,
  contextChartCountRef,
  messages,
  subjectName,
}) {
  return {
    handleExportRightPanel: () =>
      exportRightPanel({
        charts,
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
        charts,
        chartCardRefs,
        subjectName,
      }),
  };
}
