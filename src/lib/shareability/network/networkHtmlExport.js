import { downloadBlob, escapeHtml } from '../primitives/shareActions';
import { ShareIcon } from '@heroicons/react/24/outline';
import {
  buildNetworkIndex,
  networkFilenameBase,
} from './ownerNetworkShareActions';
import viewerCss from './networkViewer.runtime.css?raw';
import viewerJs from './networkViewer.runtime.js?raw';
import interWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?inline';

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
/* Matches the nodeReducer's bump for the active node in networkGraph.jsx. */
const ACTIVE_SCALE = 1.15;

const OWNER_PROFILE_PATH = '/nursing-homes/owners/';

/* The app's typeface, embedded rather than fetched so the export still opens
   offline. Descriptors and unicode-range are @fontsource-variable/inter's own —
   names outside latin fall through to the stack in the viewer stylesheet. */
const FONT_FACE = `@font-face{font-family:'Inter Variable';font-style:normal;font-display:swap;font-weight:100 900;src:url(${interWoff2}) format('woff2-variations');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}`;

/* assets/logo.jsx transcribed to markup. Pure geometry, so the mark costs no
   asset request — fill inherits from the root so CSS can color it. */
const WORDMARK =
  `<svg class="mark" width="100" height="24" viewBox="0 0 100 24" fill="currentColor" role="img" aria-label="HEFTI">` +
  `<rect x="4.17188" width="6.26087" height="23.9999"/>` +
  `<rect x="20.3438" width="6.26087" height="23.9999"/>` +
  `<rect x="99.1289" y="8.86914" width="6.26085" height="99.1304" transform="rotate(90 99.1289 8.86914)"/>` +
  `<rect x="30.2578" width="16.6957" height="5.21737"/>` +
  `<rect x="30.2578" y="18.7822" width="16.6957" height="5.21737"/>` +
  `<rect x="29.7344" y="24" width="23.9999" height="5.21739" transform="rotate(-90 29.7344 24)"/>` +
  `<rect x="50.0859" y="24" width="23.9999" height="6.26087" transform="rotate(-90 50.0859 24)"/>` +
  `<rect x="50.0859" width="17.2174" height="5.21737"/>` +
  `<rect x="68.8633" width="20.8696" height="5.21737"/>` +
  `<rect x="82.4297" y="3.13086" width="20.8695" height="6.26087" transform="rotate(90 82.4297 3.13086)"/>` +
  `<rect x="99.1289" width="23.9999" height="6.26087" transform="rotate(90 99.1289 0)"/>` +
  `</svg>`;

/* buildGraph's node palette, repeated for the legend. */
const LEGEND = [
  ['#F59E0B', 'Hub owner'],
  ['#0F766E', 'Individual'],
  ['#C2410C', 'Organization'],
];

const escAttr = (value) =>
  escapeHtml(String(value ?? '')).replace(/"/g, '&quot;');

/**
 * Recovers which node the reducer scaled up, so the export can undo it.
 *
 * There is an active node only when something has been hidden; it is then the
 * one visible node every other visible node connects to. A visible pair, or a
 * clique, answers to more than one node — those are left alone rather than
 * shrinking the wrong owner on a guess.
 */
function activeNodeId(raw, visible, adjacency) {
  if (visible.length === raw.length || visible.length < 3) return null;

  const candidates = visible.filter((id) => {
    const near = new Set((adjacency.get(id) ?? []).map((edge) => edge.id));
    return visible.every((other) => other === id || near.has(other));
  });

  return candidates.length === 1 ? candidates[0] : null;
}

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
 * active node-size metric. What the reducer does for the hovered or pinned node
 * is undone, though: it hides non-neighbors, blanks their labels and scales the
 * active node by ACTIVE_SCALE, all of which is transient view state. A file
 * opened a week later should not be cropped to whatever happened to be
 * selected, captioned with raw graphology ids, or size one owner dishonestly.
 */
export function buildNetworkSnapshot(sigma, data) {
  sigma.refresh();

  const graph = sigma.getGraph();
  const { adjacency, sharedWithSubject, hubId } = buildNetworkIndex(data);
  const byId = new Map(
    (data?.nodes ?? []).map((node) => [String(node.id), node]),
  );

  const raw = [];
  const visible = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  graph.forEachNode((id) => {
    const display = sigma.getNodeDisplayData(id);
    if (!display) return;

    const key = String(id);
    const source = byId.get(key);
    if (!display.hidden) visible.push(key);

    raw.push({
      id: key,
      /* Labels come from the payload, not display data: the reducer empties
         them for everything outside the active neighborhood. */
      label: source?.label || display.label || key,
      x: display.x,
      y: display.y,
      r: display.size ?? 8,
      color: display.color || '#C2410C',
      isHub: hubId !== null && key === hubId,
      sharedCount: sharedWithSubject.get(key) ?? 0,
      meta: source?.meta ?? {},
    });

    minX = Math.min(minX, display.x);
    minY = Math.min(minY, display.y);
    maxX = Math.max(maxX, display.x);
    maxY = Math.max(maxY, display.y);
  });

  if (!raw.length) return null;

  const inflated = activeNodeId(raw, visible, adjacency);
  raw.forEach((node) => {
    if (node.id === inflated) node.r /= ACTIVE_SCALE;
  });

  const maxRadius = raw.reduce((most, node) => Math.max(most, node.r), 0);

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

export function buildNetworkHtml({ snapshot, depth, origin, meta }) {
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

  /* Ownership and money can be different years, so the file names both rather
     than implying one date for everything in it. */
  const topologyYear = meta?.topology?.year ?? null;
  const financialYear = meta?.financials?.year ?? null;
  const sourceYears = topologyYear
    ? ` · ownership ${topologyYear}${
        financialYear && financialYear !== topologyYear
          ? `, financials ${financialYear}`
          : ''
      }`
    : '';

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
<style>${FONT_FACE}${viewerCss}</style>
</head>
<body>
<header>
${WORDMARK}
<div class="title">
<h1>${escapeHtml(hubLabel)}</h1>
<p class="meta">Ownership network${topologyYear ? ` · ${topologyYear}` : ''} · depth ${depth} · ${snapshot.nodes.length} owners · ${snapshot.links.length} connections</p>
</div>
</header>
<main>
${renderSvg(snapshot)}
<aside hidden></aside>
<div class="overlay">
<p class="legend">${legend}</p>
<p class="hint">Hover to highlight · click to pin · drag to pan · scroll to zoom</p>
</div>
</main>
<footer>Generated by HEFTI from CMS ownership data${sourceYears} · Exported ${new Date().toLocaleDateString()}</footer>
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
      meta: data?.meta,
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
