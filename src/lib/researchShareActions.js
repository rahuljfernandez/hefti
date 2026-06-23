import { chartCsvEntry, chartPngEntry } from './chartExport';
import { copyRichText, escapeHtml, downloadZip } from './shareActions';

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

/* "Full session (PDF)" is wired up visually only; PDF export is a separate
   follow-up. */
async function exportFullSession() {
  return false;
}

export function createResearchShareActions({
  assistantContentRefs,
  chartCardRefs,
  charts,
  chartToRows,
  contextChartCountRef,
  messages,
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
    handleExportFullSession: exportFullSession,
  };
}
