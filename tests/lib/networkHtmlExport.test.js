import { describe, expect, it } from 'vitest';
import {
  buildNetworkHtml,
  buildNetworkSnapshot,
} from '../../src/lib/shareability/network/networkHtmlExport';

const CANVAS = { width: 1000, height: 600 };

/* Stands in for the Sigma instance: buildNetworkSnapshot only reads the graph
   iterators, the post-reducer display caches and the canvas size, so the export
   can be exercised without a canvas or a WebGL context. Display x/y are in the
   normalized ~[0,1] space Sigma actually returns. */
function fakeSigma(nodes, edges, canvas = CANVAS) {
  return {
    refresh: () => {},
    getDimensions: () => canvas,
    getGraph: () => ({
      forEachNode: (fn) => nodes.forEach((n) => fn(n.id)),
      forEachEdge: (fn) => edges.forEach((e) => fn(e.key)),
      source: (key) => edges.find((e) => e.key === key).source,
      target: (key) => edges.find((e) => e.key === key).target,
    }),
    getNodeDisplayData: (id) => nodes.find((n) => n.id === id)?.display,
    getEdgeDisplayData: (key) => edges.find((e) => e.key === key)?.display,
  };
}

const nodes = [
  {
    id: 'oe:1',
    display: { x: 0.4, y: 0.4, size: 14, color: '#F59E0B', label: 'Hub Co' },
  },
  {
    id: 'oe:2',
    display: { x: 0.6, y: 0.5, size: 8, color: '#0F766E', label: 'Jane Doe' },
  },
  {
    id: 'oe:3',
    display: {
      x: 0.5,
      y: 0.6,
      size: 8,
      color: '#C2410C',
      label: 'Pruned Co',
      hidden: true,
    },
  },
];

const edges = [
  { key: 'e1', source: 'oe:1', target: 'oe:2', display: { size: 2 } },
  { key: 'e2', source: 'oe:1', target: 'oe:3', display: { size: 1 } },
];

const data = {
  hubId: 'oe:1',
  nodes: [
    { id: 'oe:1', label: 'Hub Co', meta: { slug: 'hub' } },
    { id: 'oe:2', label: 'Jane Doe', meta: { slug: 'jane' } },
    { id: 'oe:3', label: 'Pruned Co', meta: {} },
  ],
  links: [
    { source: 'oe:1', target: 'oe:2', weight: 4 },
    { source: 'oe:1', target: 'oe:3', weight: 1 },
  ],
};

const snapshot = (n = nodes, e = edges, canvas) =>
  buildNetworkSnapshot(fakeSigma(n, e, canvas), data);

describe('buildNetworkSnapshot', () => {
  /* A pinned node prunes the live view to its neighborhood; a downloaded file
     should still hold the whole network at that depth. */
  it('keeps nodes and edges the live view has pruned away', () => {
    const result = snapshot();

    expect(result.nodes.map((n) => n.id)).toEqual(['oe:1', 'oe:2', 'oe:3']);
    expect(result.links).toHaveLength(2);
  });

  it('frames the drawing to the graph canvas', () => {
    expect(snapshot().viewBox).toEqual([0, 0, 1000, 600]);
  });

  /* The bug this guards: display x/y come back normalized to ~[0,1] while size
     stays in pixels, so emitting them together buried every node under a circle
     wider than the entire layout. */
  it('rescales normalized positions into pixel space', () => {
    const result = snapshot();

    result.nodes.forEach((node) => {
      expect(node.x).toBeGreaterThan(node.r);
      expect(node.x).toBeLessThan(CANVAS.width - node.r);
      expect(node.y).toBeGreaterThan(node.r);
      expect(node.y).toBeLessThan(CANVAS.height - node.r);
    });

    const spread =
      Math.max(...result.nodes.map((n) => n.x)) -
      Math.min(...result.nodes.map((n) => n.x));
    const biggest = Math.max(...result.nodes.map((n) => n.r));
    expect(spread).toBeGreaterThan(biggest * 4);
  });

  it('leaves radii in pixels so the label font size stays honest', () => {
    expect(snapshot().nodes.map((n) => n.r)).toEqual([14, 8, 8]);
  });

  it('preserves the layout proportions while rescaling', () => {
    const [a, b, c] = snapshot().nodes;
    const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

    // in source coords: |ab| = hypot(.2,.1), |ac| = hypot(.1,.2) — equal
    expect(dist(a, b)).toBeCloseTo(dist(a, c), 6);
  });

  it('does not divide by zero when the layout has no span', () => {
    const single = [
      { id: 'oe:1', display: { x: 0.5, y: 0.5, size: 10, label: 'Only' } },
    ];
    const result = buildNetworkSnapshot(fakeSigma(single, []), data);

    expect(Number.isFinite(result.nodes[0].x)).toBe(true);
    expect(Number.isFinite(result.nodes[0].y)).toBe(true);
  });

  it('returns null when the graph is empty', () => {
    expect(buildNetworkSnapshot(fakeSigma([], []), data)).toBeNull();
  });

  /* The reducer empties the label of every node outside the active
     neighborhood, so reading it back from display data wrote raw graphology ids
     into the exported file. */
  it('labels pruned nodes from the payload, not the emptied display data', () => {
    const blanked = nodes.map((node) =>
      node.id === 'oe:3'
        ? { ...node, display: { ...node.display, label: '' } }
        : node,
    );

    expect(snapshot(blanked).nodes[2].label).toBe('Pruned Co');
  });

  it('falls back to the node id when nothing carries a label', () => {
    const nameless = [{ id: 'oe:9', display: { x: 0.5, y: 0.5, size: 8 } }];

    expect(
      buildNetworkSnapshot(fakeSigma(nameless, []), { nodes: [] }).nodes[0]
        .label,
    ).toBe('oe:9');
  });

  it('carries the hub flag, shared count and meta through', () => {
    const result = snapshot();

    expect(result.nodes[0].isHub).toBe(true);
    expect(result.nodes[1].isHub).toBe(false);
    expect(result.nodes[1].sharedCount).toBe(4);
    expect(result.nodes[1].meta.slug).toBe('jane');
  });
});

/* The reducer scales the hovered or pinned node by 1.15. That is transient view
   state, so a downloaded file should not show one owner 15% larger than its
   metric earns. */
describe('active-node inflation', () => {
  const payload = (links) => ({
    hubId: 'oe:1',
    nodes: ['oe:1', 'oe:2', 'oe:3', 'oe:4'].map((id) => ({
      id,
      label: id.toUpperCase(),
      meta: {},
    })),
    links,
  });

  const display = (hiddenId) =>
    [
      ['oe:1', 0.4, 0.4, 14 * 1.15],
      ['oe:2', 0.6, 0.5, 8],
      ['oe:3', 0.5, 0.6, 8],
      ['oe:4', 0.7, 0.7, 8],
    ].map(([id, x, y, size]) => ({
      id,
      display: { x, y, size, label: id, hidden: id === hiddenId },
    }));

  /* oe:1 pinned: oe:4 hangs off oe:2, so it is the one node outside the
     neighborhood and oe:1 is the only node the rest all connect to. */
  const chain = payload([
    { source: 'oe:1', target: 'oe:2', weight: 1 },
    { source: 'oe:1', target: 'oe:3', weight: 1 },
    { source: 'oe:2', target: 'oe:4', weight: 1 },
  ]);

  it('undoes the bump on the node the view has pinned', () => {
    const result = buildNetworkSnapshot(fakeSigma(display('oe:4'), []), chain);

    expect(result.nodes[0].r).toBeCloseTo(14, 6);
    expect(result.nodes.slice(1).map((node) => node.r)).toEqual([8, 8, 8]);
  });

  /* Without the nothing-hidden guard a hub wired to every other node looks
     exactly like a pinned one, and would be shrunk on an unpinned graph. */
  it('leaves sizes alone when the view has pinned nothing', () => {
    const star = payload([
      { source: 'oe:1', target: 'oe:2', weight: 1 },
      { source: 'oe:1', target: 'oe:3', weight: 1 },
      { source: 'oe:1', target: 'oe:4', weight: 1 },
    ]);

    const result = buildNetworkSnapshot(fakeSigma(display(null), []), star);

    expect(result.nodes[0].r).toBeCloseTo(14 * 1.15, 6);
  });

  it('leaves sizes alone when more than one node fits the shape', () => {
    const pair = payload([{ source: 'oe:1', target: 'oe:2', weight: 1 }]);
    const twoVisible = display('oe:3').map((node) =>
      node.id === 'oe:4'
        ? { ...node, display: { ...node.display, hidden: true } }
        : node,
    );

    const result = buildNetworkSnapshot(fakeSigma(twoVisible, []), pair);

    expect(result.nodes[0].r).toBeCloseTo(14 * 1.15, 6);
  });
});

describe('buildNetworkHtml', () => {
  const render = (overrideNodes = nodes) =>
    buildNetworkHtml({
      snapshot: snapshot(overrideNodes),
      depth: 2,
      origin: 'https://example.test',
    });

  it('emits one group per node and one line per edge', () => {
    const html = render();

    expect(html.match(/class="node/g)).toHaveLength(3);
    expect(html.match(/class="edge"/g)).toHaveLength(2);
    expect(html).toContain('data-source="oe:1"');
  });

  /* Overlapping labels are left in the markup but flagged, so hover reveals
     them instead of the picture drowning in text. */
  it('flags labels it could not place without collision', () => {
    const crowded = nodes.map((n) => ({
      ...n,
      display: {
        ...n.display,
        x: 0.5,
        y: 0.5,
        label: 'A VERY LONG OWNER NAME OPERATING HOLDCO LLC',
      },
    }));

    expect(render(crowded).match(/label-crowded/g)).toHaveLength(2);
  });

  it('leaves well-separated labels alone', () => {
    expect(render()).not.toContain('label-crowded');
  });

  /* The file has to open with no network access, so nothing may reference an
     external resource. The SVG xmlns is an identifier, not a fetch, so this
     looks for the tags that actually load something. */
  it('inlines everything and loads no external resource', () => {
    const html = render();

    expect(html).toContain('svg.graph');
    expect(html).toContain('network-payload');
    expect(html).not.toMatch(/<link\b/);
    expect(html).not.toMatch(/<script[^>]*\bsrc=/);
    expect(html).not.toMatch(/@import/);
    expect(html).not.toMatch(/url\(\s*['"]?https?:/);
  });

  /* The export should look like the app, and still open with no network. */
  it('embeds the app typeface rather than fetching it', () => {
    const html = render();

    expect(html).toContain("font-family:'Inter Variable'");
    expect(html).toContain('src:url(data:font/woff2;base64,');
  });

  /* The file travels detached from the app, so it has to say what it is and
     where the numbers came from. */
  it('stamps the mark and the data source on the document', () => {
    const html = render();

    expect(html).toContain('aria-label="HEFTI"');
    expect(html).toContain('Generated by HEFTI from CMS ownership data');
  });

  it('titles the file after the hub and the depth', () => {
    const html = render();

    expect(html).toContain('<title>Hub Co — network (depth 2)</title>');
    expect(html).toContain('3 owners');
    expect(html).toContain('2 connections');
  });

  /* Hostile names go in through the payload, which is where owner names
     actually come from — display data only ever echoes them back. */
  const renderNamed = (id, label) =>
    buildNetworkHtml({
      snapshot: buildNetworkSnapshot(fakeSigma(nodes, edges), {
        ...data,
        nodes: data.nodes.map((node) =>
          node.id === id ? { ...node, label } : node,
        ),
      }),
      depth: 2,
      origin: 'https://example.test',
    });

  it('escapes owner names so a label cannot break out of the markup', () => {
    const html = renderNamed('oe:2', '</script><img src=x onerror=alert(1)>&"');

    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('</script><img');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('escapes "<" inside the JSON payload so it cannot close the script tag', () => {
    const payload = renderNamed('oe:2', '</script>')
      .split('id="network-payload">')[1]
      .split('</script>')[0];

    expect(payload).toContain('\\u003c/script>');
    expect(JSON.parse(payload).nodes[1].label).toBe('</script>');
  });

  it('points profile links at the running origin', () => {
    const payload = render()
      .split('id="network-payload">')[1]
      .split('</script>')[0];

    expect(JSON.parse(payload).nodes[1].profileHref).toBe(
      'https://example.test/nursing-homes/owners/jane',
    );
  });

  it('keeps the topology year in exported owner profile links', () => {
    const html = buildNetworkHtml({
      snapshot: snapshot(),
      depth: 2,
      origin: 'https://example.test',
      meta: { topology: { year: 2024 } },
    });
    const payload = html
      .split('id="network-payload">')[1]
      .split('</script>')[0];

    expect(JSON.parse(payload).nodes[1].profileHref).toBe(
      'https://example.test/nursing-homes/owners/jane?year=2024',
    );
  });
});
