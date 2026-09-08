import { downloadBlob, escapeHtml } from '../primitives/shareActions';
import { ShareIcon } from '@heroicons/react/24/outline';
import {
  buildNetworkIndex,
  networkFilenameBase,
} from './ownerNetworkShareActions';
import viewerCss from './networkViewer.runtime.css?raw';
import viewerJs from './networkViewer.runtime.js?raw';

/**
 * networkHtmlExport
 *
 * Renders the owner network graph to a standalone interactive HTML file:
 * positions frozen out of the live Sigma instance into SVG, with the viewer
 * runtime inlined so hover, pin, pan and zoom survive the trip. The file opens
 * offline with no CDN and no build step.
 *
 * Sigma's own canvases can't be captured — its node and edge layers are WebGL
 * with preserveDrawingBuffer false — and re-running the layout in the export
 * would drift from what the user downloaded, so the geometry is re-emitted as
 * vector rather than screenshotted or recomputed.
 */

const PADDING = 40;
const LABEL_OFFSET = 11;
const DENSE_NODE_COUNT = 60;

const OWNER_PROFILE_PATH = '/nursing-homes/owners/';

/* buildGraph's node palette, repeated for the legend. */
const LEGEND = [
  ['#F59E0B', 'Hub owner'],
  ['#0F766E', 'Individual'],
  ['#C2410C', 'Organization'],
];

const escAttr = (value) =>
  escapeHtml(String(value ?? '')).replace(/"/g, '&quot;');

/**
 * Reads the rendered graph out of Sigma into plain data.
 *
 * Positions come from the display cache rather than the raw graph so the export
 * honors what is actually on screen: the active node-size metric, and the
 * pin/hover neighborhood filter that hides non-neighbors. The container sets
 * autoRescale false, so display coordinates are raw graph units and sizes are
 * pixels — one graph unit is one pixel at a neutral camera, which is what lets
 * the viewBox be derived without a fudge factor.
 */
export function buildNetworkSnapshot(sigma, data) {
  sigma.refresh();

  const graph = sigma.getGraph();
  const { sharedWithSubject, hubId } = buildNetworkIndex(data);
  const metaById = new Map(
    (data?.nodes ?? []).map((node) => [String(node.id), node.meta ?? {}]),
  );

  const nodes = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  graph.forEachNode((id) => {
    const display = sigma.getNodeDisplayData(id);
    if (!display || display.hidden) return;

    const key = String(id);
    const radius = display.size ?? 8;

    nodes.push({
      id: key,
      label: display.label || key,
      x: display.x,
      y: display.y,
      r: radius,
      color: display.color || '#C2410C',
      isHub: hubId !== null && key === hubId,
      sharedCount: sharedWithSubject.get(key) ?? 0,
      meta: metaById.get(key) ?? {},
    });

    minX = Math.min(minX, display.x - radius);
    minY = Math.min(minY, display.y - radius);
    maxX = Math.max(maxX, display.x + radius);
    maxY = Math.max(maxY, display.y + radius);
  });

  if (!nodes.length) return null;

  const visible = new Set(nodes.map((node) => node.id));
  const links = [];

  graph.forEachEdge((edge) => {
    const display = sigma.getEdgeDisplayData(edge);
    if (display?.hidden) return;

    const source = String(graph.source(edge));
    const target = String(graph.target(edge));
    if (!visible.has(source) || !visible.has(target)) return;

    links.push({ source, target, width: display?.size ?? 1 });
  });

  return {
    nodes,
    links,
    viewBox: [
      minX - PADDING,
      minY - PADDING,
      maxX - minX + PADDING * 2,
      maxY - minY + PADDING * 2,
    ],
  };
}

function renderSvg(snapshot) {
  const positions = new Map(snapshot.nodes.map((node) => [node.id, node]));

  const edges = snapshot.links
    .map((link) => {
      const a = positions.get(link.source);
      const b = positions.get(link.target);
      return (
        `<line class="edge" data-source="${escAttr(link.source)}" ` +
        `data-target="${escAttr(link.target)}" x1="${a.x}" y1="${a.y}" ` +
        `x2="${b.x}" y2="${b.y}" stroke-width="${link.width}"/>`
      );
    })
    .join('');

  const nodes = snapshot.nodes
    .map(
      (node) =>
        `<g class="node${node.isHub ? ' hub' : ''}" data-id="${escAttr(node.id)}">` +
        `<circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${escAttr(node.color)}"/>` +
        `<text x="${node.x}" y="${node.y + node.r + LABEL_OFFSET}" text-anchor="middle">` +
        `${escapeHtml(node.label)}</text></g>`,
    )
    .join('');

  const dense = snapshot.nodes.length > DENSE_NODE_COUNT ? ' dense' : '';

  return (
    `<svg class="graph${dense}" viewBox="${snapshot.viewBox.join(' ')}" ` +
    `xmlns="http://www.w3.org/2000/svg" role="img" ` +
    `aria-label="Owner network graph">` +
    `<g>${edges}</g><g>${nodes}</g></svg>`
  );
}

export function buildNetworkHtml({ snapshot, depth, origin }) {
  const hubLabel =
    snapshot.nodes.find((node) => node.isHub)?.label ?? 'Owner network';

  const payload = {
    profileBase: `${origin}${OWNER_PROFILE_PATH}`,
    viewBox: snapshot.viewBox,
    nodes: snapshot.nodes.map(({ id, label, isHub, sharedCount, meta }) => ({
      id,
      label,
      isHub,
      sharedCount,
      meta,
    })),
    links: snapshot.links.map((link) => [link.source, link.target]),
  };

  /* Escaping "<" keeps a "</script>" inside owner data from closing the block
     early — the payload is third-party text in an executable document. */
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');

  const legend = LEGEND.map(
    ([color, label]) =>
      `<span><i style="background:${color}"></i>${label}</span>`,
  ).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(hubLabel)} — network (depth ${depth})</title>
<style>${viewerCss}</style>
</head>
<body>
<header>
<h1>${escapeHtml(hubLabel)}</h1>
<p class="meta">Ownership network · depth ${depth} · ${snapshot.nodes.length} owners · ${snapshot.links.length} connections · exported ${new Date().toLocaleDateString()}</p>
<p class="legend">${legend}</p>
</header>
<main>
${renderSvg(snapshot)}
<aside hidden></aside>
<p class="hint">Hover to highlight · click to pin · drag to pan · scroll to zoom</p>
</main>
<script type="application/json" id="network-payload">${json}</script>
<script>${viewerJs}</script>
</body>
</html>`;
}

export async function downloadNetworkHtml({ sigma, data, depth }) {
  try {
    if (!sigma) return false;

    const snapshot = buildNetworkSnapshot(sigma, data);
    if (!snapshot) return false;

    const html = buildNetworkHtml({
      snapshot,
      depth,
      origin: window.location.origin,
    });

    return downloadBlob(
      new Blob([html], { type: 'text/html;charset=utf-8' }),
      `${networkFilenameBase(data, depth)}.html`,
    );
  } catch {
    return false;
  }
}

/* Reads the Sigma instance at click time rather than closing over it: the ref
   is filled in by SigmaBridge once the graph mounts, after this category is
   built. */
export function networkGraphShareCategory({ sigmaRef, data, depth }) {
  return {
    icon: ShareIcon,
    label: 'Graph',
    tooltip: 'Download this network as an interactive HTML file',
    loadingLabel: 'Rendering…',
    successLabel: 'Downloaded',
    emptyLabel: 'No graph',
    onClick: () =>
      downloadNetworkHtml({ sigma: sigmaRef?.current, data, depth }),
  };
}
