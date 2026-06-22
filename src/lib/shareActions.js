import { toPng } from 'html-to-image';

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
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function downloadCsv(rows, filename, headers) {
  try {
    const allRows = headers ? [headers, ...rows] : rows;
    const csv = allRows
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function downloadPng(node, filename) {
  try {
    const dataUrl = await toPng(node, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });
    triggerDownload(dataUrl, filename);
    return true;
  } catch {
    return false;
  }
}
