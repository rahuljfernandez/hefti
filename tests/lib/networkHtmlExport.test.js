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
    { id: 'oe:1', meta: { slug: 'hub' } },
    { id: 'oe:2', meta: { slug: 'jane' } },
    { id: 'oe:3', meta: {} },
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

    const spread = Math.max(...result.nodes.map((n) => n.x)) -
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

  it('carries the hub flag, shared count and meta through', () => {
    const result = snapshot();

    expect(result.nodes[0].isHub).toBe(true);
    expect(result.nodes[1].isHub).toBe(false);
    expect(result.nodes[1].sharedCount).toBe(4);
    expect(result.nodes[1].meta.slug).toBe('jane');
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

  it('titles the file after the hub and the depth', () => {
    const html = render();

    expect(html).toContain('<title>Hub Co — network (depth 2)</title>');
    expect(html).toContain('3 owners');
    expect(html).toContain('2 connections');
  });

  it('escapes owner names so a label cannot break out of the markup', () => {
    const hostile = nodes.map((n) =>
      n.id === 'oe:2'
        ? {
            ...n,
            display: {
              ...n.display,
              label: '</script><img src=x onerror=alert(1)>&"',
            },
          }
        : n,
    );

    const html = render(hostile);

    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('</script><img');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('escapes "<" inside the JSON payload so it cannot close the script tag', () => {
    const hostile = nodes.map((n) =>
      n.id === 'oe:2'
        ? { ...n, display: { ...n.display, label: '</script>' } }
        : n,
    );

    const payload = render(hostile)
      .split('id="network-payload">')[1]
      .split('</script>')[0];

    expect(payload).toContain('\\u003c/script>');
    expect(JSON.parse(payload).nodes[1].label).toBe('</script>');
  });

  it('points profile links at the running origin', () => {
    const payload = render()
      .split('id="network-payload">')[1]
      .split('</script>')[0];

    expect(JSON.parse(payload).profileBase).toBe(
      'https://example.test/nursing-homes/owners/',
    );
  });
});
