import { toPng } from 'html-to-image';
import JSZip from 'jszip';

/**
 * shareActions
 *
 * Framework-agnostic functions invoked by ShareButton (see
 * components/ui/molecule/shareability.jsx) when a user clicks a share/copy/
 * download control. Kept separate from the UI so the same actions can be
 * reused by both the lightweight ShareButton and the future telescoping
 * widget without either pulling in React.
 */

function triggerDownload(url, filename) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Regex-based, not a full markdown parser — strips common markdown syntax
   (headers, bold/italic, list markers, inline code) down to plain prose for
   contexts that can't render markdown (e.g. the PDF research brief, whose
   react-pdf <Text> has no markdown support). Formatting is lost, not
   reflowed into an equivalent rich layout — a deliberate v1 scope cut. */
export function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}([^`]*?)`{1,3}/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .trim();
}

/* Safari requires the Blobs passed to ClipboardItem be constructed
   synchronously within the user-gesture call stack — don't `await` anything
   before calling this from a click handler. */
export async function copyRichText(html, plainTextFallback) {
  if (!window.ClipboardItem || !navigator.clipboard?.write) {
    return copyText(plainTextFallback);
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainTextFallback], { type: 'text/plain' }),
      }),
    ]);
    return true;
  } catch {
    return copyText(plainTextFallback);
  }
}

function escapeCsvCell(cell) {
  const value = cell ?? '';
  const str = String(value);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function rowsToCsv(rows, headers) {
  const allRows = headers ? [headers, ...rows] : rows;
  return allRows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function downloadBlob(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  } catch {
    return false;
  }
}

export function downloadCsv(rows, filename, headers) {
  const blob = new Blob([rowsToCsv(rows, headers)], {
    type: 'text/csv;charset=utf-8;',
  });
  return downloadBlob(blob, filename);
}

export function nodeToPngDataUrl(node) {
  return toPng(node, { backgroundColor: '#ffffff', pixelRatio: 2 });
}

export async function downloadPng(node, filename) {
  try {
    const dataUrl = await nodeToPngDataUrl(node);
    triggerDownload(dataUrl, filename);
    return true;
  } catch {
    return false;
  }
}

/* entries: [{ name, content }], where content is either a plain string (CSV)
   or a PNG data URL (from nodeToPngDataUrl) — used to bundle multiple
   per-chart exports into one download instead of triggering N separate
   downloads, which Chromium browsers block past the first couple in quick
   succession. */
export async function downloadZip(entries, filename) {
  try {
    const zip = new JSZip();
    entries.forEach(({ name, content }) => {
      if (content.startsWith('data:')) {
        zip.file(name, content.split(',')[1], { base64: true });
      } else {
        zip.file(name, content);
      }
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    return downloadBlob(blob, filename);
  } catch {
    return false;
  }
}
