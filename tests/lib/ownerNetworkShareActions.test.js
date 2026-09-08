import { describe, expect, it } from 'vitest';
import {
  buildNetworkExportRows,
  buildNetworkIndex,
  networkFilenameBase,
  networkOwnersExportConfig,
} from '../../src/lib/shareability/network/ownerNetworkShareActions';

/* o1 is the subject; o2 and o3 sit one hop out; o4 is reachable only through
   them; o5 is in the payload but connected to nothing. */
const data = {
  hubId: 'o1',
  nodes: [
    {
      id: 'o1',
      label: 'Bethesda Operating LLC',
      meta: {
        slug: 'bethesda-operating',
        cms_ownership_type: 'Organization',
        total_facilities: 1,
        star_rating: 3,
        cms_owner_avg_operating_margin: -10.9,
        cms_owner_avg_related_to_total_exp: 10.8,
      },
    },
    {
      id: 'o2',
      label: 'Rubin, Jeffrey',
      meta: { cms_ownership_type: 'Individual', total_facilities: 18 },
    },
    {
      id: 'o3',
      label: 'Cole, Warren',
      meta: { cms_ownership_type: 'Individual', total_facilities: 17 },
    },
    { id: 'o4', label: 'Straus, Daniel', meta: { total_facilities: 38 } },
    { id: 'o5', label: 'Orphan Co', meta: {} },
  ],
  links: [
    { source: 'o1', target: 'o2', weight: 2 },
    { source: 'o1', target: 'o3', weight: 1 },
    { source: 'o2', target: 'o4', weight: 5 },
    { source: 'o3', target: 'o4', weight: 3 },
  ],
};

const byId = (rows) => Object.fromEntries(rows.map((row) => [row.id, row]));

describe('buildNetworkIndex', () => {
  it('walks hop distance outward from the subject', () => {
    const { hops } = buildNetworkIndex(data);

    expect([...hops.entries()].sort()).toEqual([
      ['o1', 0],
      ['o2', 1],
      ['o3', 1],
      ['o4', 2],
    ]);
  });

  it('leaves an unconnected owner out of the hop map entirely', () => {
    expect(buildNetworkIndex(data).hops.has('o5')).toBe(false);
  });

  it('counts facilities shared with the subject from link weights', () => {
    const { sharedWithSubject } = buildNetworkIndex(data);

    expect(sharedWithSubject.get('o2')).toBe(2);
    expect(sharedWithSubject.get('o3')).toBe(1);
    expect(sharedWithSubject.get('o4')).toBeUndefined();
  });

  it('survives a payload with no links or no hub', () => {
    expect(buildNetworkIndex({}).hops.size).toBe(0);
    expect(buildNetworkIndex({ hubId: 'missing', nodes: [] }).hops.size).toBe(
      0,
    );
  });
});

describe('buildNetworkExportRows', () => {
  it('derives connection count and total shared facilities per owner', () => {
    const rows = byId(buildNetworkExportRows(data));

    expect([rows.o2.connections, rows.o2.sharedTotal]).toEqual([2, 7]);
    expect([rows.o4.connections, rows.o4.sharedTotal]).toEqual([2, 8]);
    expect([rows.o5.connections, rows.o5.sharedTotal]).toEqual([0, 0]);
  });

  it('orders outward from the subject, most entangled first within a ring', () => {
    expect(buildNetworkExportRows(data).map((row) => row.id)).toEqual([
      'o1',
      'o2',
      'o3',
      'o4',
      'o5',
    ]);
  });

  it('returns nothing for an empty payload', () => {
    expect(buildNetworkExportRows({})).toEqual([]);
  });
});

describe('networkOwnersExportConfig.toRow', () => {
  it('labels the subject, a direct tie, and an indirect one', () => {
    const rows = byId(buildNetworkExportRows(data));

    expect(networkOwnersExportConfig.toRow(rows.o1)[1]).toBe('Subject');
    expect(networkOwnersExportConfig.toRow(rows.o2)[1]).toBe(
      'Direct (depth 1)',
    );
    expect(networkOwnersExportConfig.toRow(rows.o4)[1]).toBe(
      'Indirect (depth 2)',
    );
    expect(networkOwnersExportConfig.toRow(rows.o5)[1]).toBe('Not connected');
  });

  it('emits the subject row with raw values and its id last', () => {
    const rows = byId(buildNetworkExportRows(data));

    expect(networkOwnersExportConfig.toRow(rows.o1)).toEqual([
      'Bethesda Operating LLC',
      'Subject',
      'Organization',
      '1',
      0,
      2,
      3,
      '3',
      '-10.9',
      '10.8',
      'o1',
    ]);
  });

  it('marks missing owner attributes N/A without dropping the derived counts', () => {
    const rows = byId(buildNetworkExportRows(data));

    expect(networkOwnersExportConfig.toRow(rows.o4)).toEqual([
      'Straus, Daniel',
      'Indirect (depth 2)',
      'N/A',
      '38',
      0,
      2,
      8,
      'N/A',
      'N/A',
      'N/A',
      'o4',
    ]);
  });

  it('keeps every row aligned with the headers', () => {
    buildNetworkExportRows(data).forEach((row) => {
      expect(networkOwnersExportConfig.toRow(row)).toHaveLength(
        networkOwnersExportConfig.headers.length,
      );
    });
  });
});

describe('networkFilenameBase', () => {
  it('names the file after the subject slug and the current depth', () => {
    expect(networkFilenameBase(data, 2)).toBe(
      'bethesda-operating-network-depth-2',
    );
  });

  it('falls back to the hub id when the subject carries no slug', () => {
    const noSlug = { hubId: 'o9', nodes: [{ id: 'o9', meta: {} }] };

    expect(networkFilenameBase(noSlug, 1)).toBe('o9-network-depth-1');
  });

  it('falls back again when there is no hub node at all', () => {
    expect(networkFilenameBase({ nodes: [] }, 1)).toBe('owner-network-depth-1');
  });
});
