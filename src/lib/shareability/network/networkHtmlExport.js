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

const LABEL_OFFSET = 11;
const LABEL_FONT_SIZE = 11;
/* Rough advance width per character at LABEL_FONT_SIZE — only needs to be good
   enough to decide which labels collide. */
const LABEL_CHAR_WIDTH = 0.55 * LABEL_FONT_SIZE;
const FALLBACK_CANVAS = { width: 1600, height: 900 };

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
 * Reads the rendered graph out of Sigma into plain data, in pixel space.
 *
 * Display data mixes two coordinate systems: x/y come back normalized to
 * roughly [0,1] (autoRescale:false only widens the extent, it does not skip
 * normalizationFunction), while size stays in pixels. Emitting them together
 * collapses every node onto one point under circles many times the width of the
 * whole layout. So positions are rescaled here to fill the graph canvas, and
 * radii are left alone — after which one SVG user unit is one pixel and the
 * label font size means what it says.
 *
 * Sizes and colors are still read post-reducer so the export reflects the
 * active node-size metric. `hidden` is deliberately ignored: a pinned node
 * prunes the on-screen view to its neighborhood, and a file opened a week later
 * should not be silently cropped to whatever happened to be selected.
 */
export function buildNetworkSnapshot(sigma, data) {
  sigma.refresh();

  const graph = sigma.getGraph();
  const { sharedWithSubject, hubId } = buildNetworkIndex(data);
  const metaById = new Map(
    (data?.nodes ?? []).map((node) => [String(node.id), node.meta ?? {}]),
  );

  const raw = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxRadius = 0;

  graph.forEachNode((id) => {
    const display = sigma.getNodeDisplayData(id);
    if (!display) return;

    const key = String(id);
    const radius = display.size ?? 8;

    raw.push({
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

    minX = Math.min(minX, display.x);
    minY = Math.min(minY, display.y);
    maxX = Math.max(maxX, display.x);
    maxY = Math.max(maxY, display.y);
    maxRadius = Math.max(maxRadius, radius);
  });

  if (!raw.length) return null;

  const canvas = sigma.getDimensions?.() ?? FALLBACK_CANVAS;
  const width = canvas.width || FALLBACK_CANVAS.width;
  const height = canvas.height || FALLBACK_CANVAS.height;

  /* Room for a node's own radius plus the label sitting under it. */
  const margin = maxRadius + LABEL_OFFSET + LABEL_FONT_SIZE * 2;
  const usableWidth = Math.max(1, width - margin * 2);
  const usableHeight = Math.max(1, height - margin * 2);

  /* A single node, or a layout that collapsed to a line, has no span on one
     axis — fall back to scale 1 rather than dividing by zero. */
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale =
    spanX > 0 || spanY > 0
      ? Math.min(
          spanX > 0 ? usableWidth / spanX : Infinity,
          spanY > 0 ? usableHeight / spanY : Infinity,
        )
      : 1;

  const offsetX = margin + (usableWidth - spanX * scale) / 2;
  const offsetY = margin + (usableHeight - spanY * scale) / 2;

  const nodes = raw.map((node) => ({
    ...node,
    x: offsetX + (node.x - minX) * scale,
    y: offsetY + (node.y - minY) * scale,
  }));

  const present = new Set(nodes.map((node) => node.id));
  const links = [];

  graph.forEachEdge((edge) => {
    const source = String(graph.source(edge));
    const target = String(graph.target(edge));
    if (!present.has(source) || !present.has(target)) return;

    links.push({
      source,
      target,
      width: sigma.getEdgeDisplayData(edge)?.size ?? 1,
    });
  });

  return { nodes, links, viewBox: [0, 0, width, height] };
}

/**
 * Chooses which labels to draw so the picture stays readable.
 *
 * A force layout puts nodes close enough that drawing every label produces a
 * pile of overlapping text. Sigma solves this on screen with its label grid;
 * here the equivalent is one greedy pass — biggest nodes claim their space
 * first, and a label that would collide is left for hover to reveal.
 */
function placeLabels(nodes) {
  const placed = [];
  const keep = new Set();

  [...nodes]
    .sort((a, b) => (b.isHub ? 1 : 0) - (a.isHub ? 1 : 0) || b.r - a.r)
    .forEach((node) => {
      const halfWidth = (node.label.length * LABEL_CHAR_WIDTH) / 2;
      const top = node.y + node.r + LABEL_OFFSET - LABEL_FONT_SIZE;
      const box = {
        left: node.x - halfWidth,
        right: node.x + halfWidth,
        top,
        bottom: top + LABEL_FONT_SIZE * 1.4,
      };

      const collides = placed.some(
        (other) =>
          box.left < other.right &&
          box.right > other.left &&
          box.top < other.bottom &&
          box.bottom > other.top,
      );

      if (collides) return;
      placed.push(box);
      keep.add(node.id);
    });

  return keep;
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

  const labelled = placeLabels(snapshot.nodes);

  const nodes = snapshot.nodes
    .map((node) => {
      const classes = [
        'node',
        node.isHub ? 'hub' : '',
        labelled.has(node.id) ? '' : 'label-crowded',
      ]
        .filter(Boolean)
        .join(' ');

      return (
        `<g class="${classes}" data-id="${escAttr(node.id)}">` +
        `<circle cx="${node.x}" cy="${node.y}" r="${node.r}" fill="${escAttr(node.color)}"/>` +
        `<text x="${node.x}" y="${node.y + node.r + LABEL_OFFSET}" text-anchor="middle">` +
        `${escapeHtml(node.label)}</text></g>`
      );
    })
    .join('');

  return (
    `<svg class="graph" viewBox="${snapshot.viewBox.join(' ')}" ` +
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
