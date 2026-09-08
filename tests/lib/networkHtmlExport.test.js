import { describe, expect, it } from 'vitest';
import {
  buildNetworkHtml,
  buildNetworkSnapshot,
} from '../../src/lib/shareability/network/networkHtmlExport';

/* Stands in for the Sigma instance: buildNetworkSnapshot only reads the graph
   iterators and the post-reducer display caches, so the export can be exercised
   without a canvas or a WebGL context. */
function fakeSigma(nodes, edges) {
  return {
    refresh: () => {},
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
    display: { x: 0, y: 0, size: 14, color: '#F59E0B', label: 'Hub Holdings' },
  },
  {
    id: 'oe:2',
    display: { x: 100, y: 50, size: 8, color: '#0F766E', label: 'Jane Doe' },
  },
  {
    id: 'oe:3',
    display: {
      x: 999,
      y: 999,
      size: 8,
      color: '#C2410C',
      label: 'Hidden Co',
      hidden: true,
    },
  },
];

const edges = [
  { key: 'e1', source: 'oe:1', target: 'oe:2', display: { size: 2 } },
  { key: 'e2', source: 'oe:1', target: 'oe:3', display: { size: 1 } },
];

/* Shared counts come from link weights, so the payload needs its links even
   though the geometry is read from the stub Sigma. */
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

describe('buildNetworkSnapshot', () => {
  it('drops hidden nodes and any edge that touches one', () => {
    const snapshot = buildNetworkSnapshot(fakeSigma(nodes, edges), data);

    expect(snapshot.nodes.map((n) => n.id)).toEqual(['oe:1', 'oe:2']);
    expect(snapshot.links).toEqual([
      { source: 'oe:1', target: 'oe:2', width: 2 },
    ]);
  });

  it('flags the hub and carries the shared count and meta through', () => {
    const snapshot = buildNetworkSnapshot(fakeSigma(nodes, edges), data);

    expect(snapshot.nodes[0].isHub).toBe(true);
    expect(snapshot.nodes[1].isHub).toBe(false);
    expect(snapshot.nodes[1].sharedCount).toBe(4);
    expect(snapshot.nodes[1].meta.slug).toBe('jane');
  });

  it('frames every visible node, radius and padding included', () => {
    const [x, y, width, height] = buildNetworkSnapshot(
      fakeSigma(nodes, edges),
      data,
    ).viewBox;

    // hub spans -14..14, Jane spans 92..108 / 42..58, padding is 40
    expect([x, y]).toEqual([-54, -54]);
    expect(x + width).toBe(148);
    expect(y + height).toBe(98);
  });

  it('returns null when nothing is visible', () => {
    const allHidden = nodes.map((n) => ({
      ...n,
      display: { ...n.display, hidden: true },
    }));

    expect(buildNetworkSnapshot(fakeSigma(allHidden, []), data)).toBeNull();
  });
});

describe('buildNetworkHtml', () => {
  const render = (overrideNodes = nodes) =>
    buildNetworkHtml({
      snapshot: buildNetworkSnapshot(fakeSigma(overrideNodes, edges), data),
      depth: 2,
      origin: 'https://example.test',
    });

  it('emits one group per visible node and one line per visible edge', () => {
    const html = render();

    expect(html.match(/class="node/g)).toHaveLength(2);
    expect(html.match(/class="edge"/g)).toHaveLength(1);
    expect(html).toContain('data-source="oe:1"');
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

    expect(html).toContain('<title>Hub Holdings — network (depth 2)</title>');
    expect(html).toContain('2 owners');
    expect(html).toContain('1 connections');
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
