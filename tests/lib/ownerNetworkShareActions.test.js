import { describe, expect, it } from 'vitest';
import {
  buildNetworkExportRows,
  networkConnectionsExportConfig,
  networkFilenameBase,
  networkOwnersExportConfig,
} from '../../src/lib/shareability/network/ownerNetworkShareActions';

const data = {
  hubId: 'o1',
  nodes: [
    {
      id: 'o1',
      label: 'Hub Holdings',
      meta: {
        slug: 'hub-holdings',
        cms_ownership_type: 'Organization',
        total_facilities: 12,
        star_rating: 3.4,
        cms_owner_avg_operating_margin: 4.1,
        cms_owner_avg_related_to_total_exp: 18.2,
        sharedFacilities: [
          { ownerId: 'o2', ownerName: 'Jane Doe', count: 3 },
          { ownerId: 'o3', ownerName: 'Third Co', count: 1 },
        ],
      },
    },
    {
      id: 'o2',
      label: 'Jane Doe',
      meta: { slug: 'jane-doe', cms_ownership_type: 'Individual' },
    },
    { id: 'o3', label: 'Third Co', meta: {} },
  ],
  links: [
    { source: 'o1', target: 'o2', relType: 'shared facilities', weight: 3 },
    { source: 'o1', target: 'o3', weight: 1 },
  ],
};

describe('buildNetworkExportRows', () => {
  it('flags the hub and resolves each owner shared-facility count', () => {
    const { ownerRows } = buildNetworkExportRows(data);

    expect(
      ownerRows.map((row) => [row.id, row.isHub, row.sharedCount]),
    ).toEqual([
      ['o1', true, null],
      ['o2', false, 3],
      ['o3', false, 1],
    ]);
  });

  it('resolves link endpoint ids to owner labels', () => {
    const { connectionRows } = buildNetworkExportRows(data);

    expect(
      connectionRows.map((row) => [row.sourceLabel, row.targetLabel]),
    ).toEqual([
      ['Hub Holdings', 'Jane Doe'],
      ['Hub Holdings', 'Third Co'],
    ]);
  });

  it('falls back to the raw id when a link points at a missing node', () => {
    const { connectionRows } = buildNetworkExportRows({
      ...data,
      links: [{ source: 'o1', target: 'gone', weight: 2 }],
    });

    expect(connectionRows[0].targetLabel).toBe('gone');
  });

  it('handles a payload with no nodes or links', () => {
    expect(buildNetworkExportRows({})).toEqual({
      ownerRows: [],
      connectionRows: [],
    });
  });
});

describe('networkOwnersExportConfig.toRow', () => {
  it('emits raw values with N/A for anything missing', () => {
    const { ownerRows } = buildNetworkExportRows(data);

    expect(networkOwnersExportConfig.toRow(ownerRows[0])).toEqual([
      'o1',
      'Hub Holdings',
      'Hub',
      'Organization',
      '12',
      'N/A',
      '3.4',
      '4.1',
      '18.2',
      'hub-holdings',
    ]);

    expect(networkOwnersExportConfig.toRow(ownerRows[2])).toEqual([
      'o3',
      'Third Co',
      'Connected',
      'N/A',
      'N/A',
      '1',
      'N/A',
      'N/A',
      'N/A',
      'N/A',
    ]);
  });

  it('keeps a row aligned with its headers', () => {
    const { ownerRows } = buildNetworkExportRows(data);

    expect(networkOwnersExportConfig.toRow(ownerRows[0])).toHaveLength(
      networkOwnersExportConfig.headers.length,
    );
  });
});

describe('networkConnectionsExportConfig.toRow', () => {
  it('emits both endpoints, the relationship, and the weight', () => {
    const { connectionRows } = buildNetworkExportRows(data);

    expect(networkConnectionsExportConfig.toRow(connectionRows[0])).toEqual([
      'o1',
      'Hub Holdings',
      'o2',
      'Jane Doe',
      'shared facilities',
      '3',
    ]);
  });

  it('marks a link with no relationship type as N/A', () => {
    const { connectionRows } = buildNetworkExportRows(data);

    expect(networkConnectionsExportConfig.toRow(connectionRows[1])[4]).toBe(
      'N/A',
    );
  });
});

describe('networkFilenameBase', () => {
  it('names the file after the hub slug and the current depth', () => {
    expect(networkFilenameBase(data, 2)).toBe('hub-holdings-network-depth-2');
  });

  it('falls back to the hub id when the hub carries no slug', () => {
    const noSlug = { hubId: 'o9', nodes: [{ id: 'o9', meta: {} }] };

    expect(networkFilenameBase(noSlug, 1)).toBe('o9-network-depth-1');
  });

  it('falls back again when there is no hub node at all', () => {
    expect(networkFilenameBase({ nodes: [] }, 1)).toBe('owner-network-depth-1');
  });
});
