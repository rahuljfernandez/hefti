import { copyText, downloadCsv } from '../primitives/shareActions';
import { LinkIcon, TableCellsIcon } from '@heroicons/react/24/outline';

/**
 * profileShareActions
 *
 * Shared base for every profile subject's exports. Sits on the generic
 * shareActions.js primitives and holds the pieces common to all profiles — the
 * copy-link action, the generic CSV download, and the copy-link / CSV
 * ShareWidget category factories. Subject-specific shaping lives alongside in
 * facilityShareActions.js, ownerShareActions.js, and stateShareActions.js; each
 * page composes the shared categories here with its own subject categories into
 * the header's ShareWidget (ProfileHeader just renders the array it's given).
 */

/* Copies a link to the current profile to the clipboard. Reads the live URL so
   the copied link carries whatever slug/route the visitor is actually on. */
export function copyProfileLink() {
  return copyText(window.location.href);
}

/* Writes the supplied rows to CSV via the given config. An optional `filename`
   overrides config.filename (used to name the file after the profile subject).
   Returns false on an empty set so the ShareWidget segment can surface its empty
   state instead of downloading a header-only file. */
export function downloadProfileCsv(rows, config, filename) {
  if (!rows?.length) return false;
  return downloadCsv(
    rows.map(config.toRow),
    filename || config.filename,
    config.headers,
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Shared ShareWidget category factories. Each returns one telescoping-widget
   category so pages compose their own header export set; ProfileHeader just
   renders the array it's handed. Subject-specific categories (e.g. the facility
   ZIP) live in the per-subject files.
   ──────────────────────────────────────────────────────────────────────── */

export function copyLinkShareCategory() {
  return {
    icon: LinkIcon,
    label: 'Copy link',
    tooltip: 'Copy a link to this profile',
    successLabel: 'Copied',
    emptyLabel: 'Copy failed',
    onClick: copyProfileLink,
  };
}

export function csvShareCategory(rows, config, filename) {
  return {
    icon: TableCellsIcon,
    label: 'Download CSV',
    tooltip: config.tooltip ?? 'Download as CSV',
    loadingLabel: 'Preparing…',
    successLabel: 'Downloaded',
    emptyLabel: 'No data',
    onClick: () => downloadProfileCsv(rows, config, filename),
  };
}
