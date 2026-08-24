import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  loadStateFacilities,
  loadStateProfile,
} from '../../src/lib/stateProfileApi';

function response(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(payload),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('state profile rolling-deploy API compatibility', () => {
  it('falls back to the three legacy state routes when /state-profile is absent', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(404, {}))
      .mockResolvedValueOnce(response(200, { state: 'VA', facilities: 10 }))
      .mockResolvedValueOnce(response(200, { data: [{ name: 'Chain' }] }))
      .mockResolvedValueOnce(response(200, { data: [{ name: 'Owner' }] }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      loadStateProfile('/api', 'VA', 2026, undefined),
    ).resolves.toMatchObject({
      state: 'VA',
      chain_burden: [{ name: 'Chain' }],
      individual_burden: [{ name: 'Owner' }],
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not hide a real state-facilities server failure behind legacy data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(500, {})));

    await expect(
      loadStateFacilities('/api', 'VA', 2026, undefined),
    ).rejects.toMatchObject({ status: 500 });
  });

  it('normalizes owners when falling back to the generic facilities route', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(404, {}))
      .mockResolvedValueOnce(
        response(200, {
          data: [
            {
              id: 1,
              facility_ownership_links: [
                {
                  is_display_owner: 0,
                  ownership_entity: {
                    slug: 'primary',
                    cms_ownership_name: 'Primary Owner',
                  },
                },
                {
                  is_display_owner: 1,
                  ownership_entity: {
                    slug: 'display',
                    cms_ownership_name: 'Display Owner',
                  },
                },
              ],
            },
          ],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      loadStateFacilities('/api', 'VA', 2026, undefined),
    ).resolves.toEqual([
      expect.objectContaining({
        owner: { slug: 'display', name: 'Display Owner' },
        primary_owner: { slug: 'primary', name: 'Primary Owner' },
      }),
    ]);
  });
});
