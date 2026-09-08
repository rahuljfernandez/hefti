import { downloadCsv } from '../primitives/shareActions';
import { TableCellsIcon } from '@heroicons/react/24/outline';

/**
 * ownerNetworkShareActions
 *
 * Export logic for the owner network graph modal, layered on the generic
 * shareActions.js primitives. Shapes the network into a single owner roster:
 * one row per owner, ordered outward from the subject, carrying how each owner
 * is connected and the signals that make a related-party network worth reading.
 *
 * Sibling to profile/ownerShareActions.js rather than part of it: the graph is
 * its own surface, with its own controller and portal, and the HTML export in
 * networkHtmlExport.js pulls Sigma in alongside this shaping.
 */

/* Raw numbers rather than the display-formatted strings the profile CSVs use —
   units live in the headers instead, so the columns land in a spreadsheet ready
   to sort and chart. */
const naIfBlank = (value) =>
  value == null || value === '' ? 'N/A' : String(value);

function relationshipLabel(hops) {
  if (hops == null) return 'Not connected';
  if (hops === 0) return 'Subject';
  if (hops === 1) return 'Direct (depth 1)';
  return `Indirect (depth ${hops})`;
}

/**
 * Derives every relational fact the exports need in one pass.
 *
 * The payload carries no hop distance — node.type is only 'hub' or 'owner' — so
 * depth is a breadth-first walk out from the subject. Shared-facility counts
 * come from link.weight, which is on every link, rather than node
 * meta.sharedFacilities, which the API only populates on the hub.
 */
export function buildNetworkIndex(data) {
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const links = Array.isArray(data?.links) ? data.links : [];
  const hubId = data?.hubId == null ? null : String(data.hubId);

  const adjacency = new Map();
  const connect = (from, to, weight) => {
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from).push({ id: to, weight: Number(weight) || 0 });
  };

  for (const link of links) {
    if (link?.source == null || link?.target == null) continue;
    const source = String(link.source);
    const target = String(link.target);
    if (source === target) continue;
    connect(source, target, link.weight);
    connect(target, source, link.weight);
  }

  const hops = new Map();
  if (hubId !== null && nodes.some((node) => String(node.id) === hubId)) {
    hops.set(hubId, 0);
    const queue = [hubId];
    while (queue.length) {
      const current = queue.shift();
      for (const edge of adjacency.get(current) ?? []) {
        if (hops.has(edge.id)) continue;
        hops.set(edge.id, hops.get(current) + 1);
        queue.push(edge.id);
      }
    }
  }

  const sharedWithSubject = new Map();
  for (const edge of adjacency.get(hubId) ?? []) {
    sharedWithSubject.set(
      edge.id,
      (sharedWithSubject.get(edge.id) ?? 0) + edge.weight,
    );
  }

  return { adjacency, hops, sharedWithSubject, hubId };
}

/* One row per owner, ordered outward from the subject and, within a ring, by
   how entangled each owner is — so the largest operators behind a small
   subject surface at the top rather than in alphabetical scatter. */
export function buildNetworkExportRows(data) {
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const { adjacency, hops, sharedWithSubject, hubId } = buildNetworkIndex(data);

  return nodes
    .map((node) => {
      const id = String(node.id);
      const edges = adjacency.get(id) ?? [];

      return {
        id,
        label: node.label || id,
        meta: node.meta ?? {},
        hops: hops.get(id) ?? null,
        isHub: hubId !== null && id === hubId,
        connections: edges.length,
        sharedTotal: edges.reduce((sum, edge) => sum + edge.weight, 0),
        sharedWithSubject: sharedWithSubject.get(id) ?? 0,
      };
    })
    .sort(
      (a, b) =>
        (a.hops ?? Infinity) - (b.hops ?? Infinity) ||
        b.sharedTotal - a.sharedTotal ||
        a.label.localeCompare(b.label),
    );
}

/* Deliberately narrow. The clinical, staffing and raw-dollar fields on
   node.meta are all populated, but a network export answers "who is entangled
   with this owner, and does the money look extractive" — the per-owner detail
   belongs on the profile page. Related-party expense ratio is the column the
   file exists for. */
export const networkOwnersExportConfig = {
  filename: 'owner-network.csv',
  tooltip: 'Download this network as CSV',
  headers: [
    'Owner Name',
    'Relationship',
    'Ownership Type',
    'Total Facilities',
    'Facilities Shared With Subject',
    'Connections In Network',
    'Total Shared Facilities',
    'Star Rating',
    'Operating Margin (%)',
    'Related Party Expense Ratio (%)',
    'Owner ID',
  ],
  toRow: (row) => [
    row.label,
    relationshipLabel(row.hops),
    naIfBlank(row.meta.cms_ownership_type),
    naIfBlank(row.meta.total_facilities),
    row.sharedWithSubject,
    row.connections,
    row.sharedTotal,
    naIfBlank(row.meta.star_rating),
    naIfBlank(row.meta.cms_owner_avg_operating_margin),
    naIfBlank(row.meta.cms_owner_avg_related_to_total_exp),
    /* Individuals share names often enough that the id is what tells two
       owners apart. */
    row.id,
  ],
};

/* Filename stem for every network export. The subject's slug keeps files
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

export function downloadOwnerNetworkCsv({ data, depth }) {
  try {
    const rows = buildNetworkExportRows(data);
    if (!rows.length) return false;

    return downloadCsv(
      rows.map(networkOwnersExportConfig.toRow),
      `${networkFilenameBase(data, depth)}.csv`,
      networkOwnersExportConfig.headers,
    );
  } catch {
    return false;
  }
}

export function networkDataShareCategory({ data, depth }) {
  return {
    icon: TableCellsIcon,
    label: 'Data',
    tooltip: 'Download the owners in this network as CSV',
    loadingLabel: 'Preparing…',
    successLabel: 'Downloaded',
    emptyLabel: 'No data',
    onClick: () => downloadOwnerNetworkCsv({ data, depth }),
  };
}
