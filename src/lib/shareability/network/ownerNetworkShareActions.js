import { rowsToCsv, downloadZip } from '../primitives/shareActions';
import { TableCellsIcon } from '@heroicons/react/24/outline';

/**
 * ownerNetworkShareActions
 *
 * Export logic for the owner network graph modal, layered on the generic
 * shareActions.js primitives. Owns the network-specific data shaping: an owners
 * CSV (one row per node) and a connections CSV (one row per link), bundled into
 * a ZIP, plus the ShareWidget category the modal nav renders.
 *
 * Sibling to profile/ownerShareActions.js rather than part of it: the graph is
 * its own surface, with its own controller and portal, and the HTML export in
 * networkHtmlExport.js pulls Sigma in alongside this shaping.
 */

/* Exports carry raw numbers rather than the display-formatted strings the
   profile CSVs use — units live in the headers instead, so the columns land in
   a spreadsheet ready to sort and chart. */
const naIfBlank = (value) =>
  value == null || value === '' ? 'N/A' : String(value);

/* Only the hub node carries sharedFacilities, listing every owner it co-owns
   facilities with. Flattening it to a Map gives each row its shared-facility
   count against the hub — the same "N Links" number the nav search dropdown
   shows, built the same way GraphSearchController builds it. */
export function buildSharedCountMap(nodes) {
  const counts = new Map();
  for (const node of nodes ?? []) {
    for (const shared of node?.meta?.sharedFacilities ?? []) {
      counts.set(String(shared.ownerId), shared.count);
    }
  }
  return counts;
}

/* Resolves node ids to labels for the connections CSV, where links carry ids
   only. */
export function buildNodeLabelMap(nodes) {
  const labels = new Map();
  for (const node of nodes ?? []) {
    if (node?.id == null) continue;
    labels.set(String(node.id), node.label || String(node.id));
  }
  return labels;
}

export const networkOwnersExportConfig = {
  filename: 'owners.csv',
  tooltip: 'Download the owners in this network as CSV',
  headers: [
    'Owner ID',
    'Owner Name',
    'Role in Network',
    'Ownership Type',
    'Total Facilities',
    'Shared Facilities',
    'Star Rating',
    'Operating Margin (%)',
    'Related Party Expense Ratio (%)',
    'Profile Slug',
  ],
  toRow: (node) => [
    node.id,
    node.label || String(node.id),
    node.isHub ? 'Hub' : 'Connected',
    naIfBlank(node.meta?.cms_ownership_type),
    naIfBlank(node.meta?.total_facilities),
    naIfBlank(node.sharedCount),
    naIfBlank(node.meta?.star_rating),
    naIfBlank(node.meta?.cms_owner_avg_operating_margin),
    naIfBlank(node.meta?.cms_owner_avg_related_to_total_exp),
    naIfBlank(node.meta?.slug),
  ],
};

export const networkConnectionsExportConfig = {
  filename: 'connections.csv',
  tooltip: 'Download the connections in this network as CSV',
  headers: [
    'Source ID',
    'Source Name',
    'Target ID',
    'Target Name',
    'Relationship',
    'Shared Facilities',
  ],
  toRow: (link) => [
    link.source,
    link.sourceLabel,
    link.target,
    link.targetLabel,
    naIfBlank(link.relType),
    naIfBlank(link.weight),
  ],
};

/* Decorates the raw payload nodes/links with the fields the two configs read,
   so toRow stays a pure per-item mapping and the id→label and id→count lookups
   are each built once. */
export function buildNetworkExportRows(data) {
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const links = Array.isArray(data?.links) ? data.links : [];

  const sharedCounts = buildSharedCountMap(nodes);
  const labels = buildNodeLabelMap(nodes);
  const hubId = data?.hubId == null ? null : String(data.hubId);

  return {
    ownerRows: nodes.map((node) => ({
      ...node,
      isHub: hubId !== null && String(node.id) === hubId,
      sharedCount: sharedCounts.get(String(node.id)) ?? null,
    })),
    connectionRows: links.map((link) => ({
      ...link,
      sourceLabel: labels.get(String(link.source)) ?? String(link.source),
      targetLabel: labels.get(String(link.target)) ?? String(link.target),
    })),
  };
}

/* Filename stem for every network export. The hub's slug keeps files
   recognizable in a downloads folder; depth is part of the name because the
   export is a snapshot of the current filter, so two depths of the same owner
   must not collide. */
export function networkFilenameBase(data, depth) {
  const hub = data?.nodes?.find(
    (node) => String(node.id) === String(data?.hubId),
  );
  const stem = hub?.meta?.slug || hub?.id || data?.hubId || 'owner';
  return `${stem}-network-depth-${depth}`;
}

export async function downloadOwnerNetworkZip({ data, depth }) {
  try {
    const { ownerRows, connectionRows } = buildNetworkExportRows(data);
    if (!ownerRows.length) return false;

    const entries = [
      {
        name: networkOwnersExportConfig.filename,
        content: rowsToCsv(
          ownerRows.map(networkOwnersExportConfig.toRow),
          networkOwnersExportConfig.headers,
        ),
      },
    ];

    if (connectionRows.length) {
      entries.push({
        name: networkConnectionsExportConfig.filename,
        content: rowsToCsv(
          connectionRows.map(networkConnectionsExportConfig.toRow),
          networkConnectionsExportConfig.headers,
        ),
      });
    }

    return downloadZip(entries, `${networkFilenameBase(data, depth)}.zip`);
  } catch {
    return false;
  }
}

export function networkDataShareCategory({ data, depth }) {
  return {
    icon: TableCellsIcon,
    label: 'Data',
    tooltip: 'Download the owners & connections in this network as CSV',
    loadingLabel: 'Zipping…',
    successLabel: 'Downloaded',
    emptyLabel: 'No data',
    onClick: () => downloadOwnerNetworkZip({ data, depth }),
  };
}
