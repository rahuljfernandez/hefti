import { describe, expect, it } from 'vitest';
import {
  buildLargestHoldings,
  buildRealEstateHighlights,
  buildStateProperties,
  buildStateRealEstateSummary,
} from '../../src/lib/stateRealEstateMetrics';

function facility(overrides = {}) {
  return {
    id: 1,
    slug: 'facility-one',
    provider_name: 'Facility One',
    city: 'Shreveport',
    state: 'LA',
    latitude: 32.5,
    longitude: -93.7,
    realie_parcel_id: '171411-105-0001-00 01',
    realie_county: 'Caddo',
    realie_owner_name: 'Shared Titleholder LLC',
    realie_market_value: 7414360,
    realie_assessed_value: null,
    realie_titleholder_differs: false,
    owner: { slug: 'shared-operator', name: 'Shared Operator' },
    ...overrides,
  };
}

describe('state real estate parcel aggregation', () => {
  it('counts and values a shared physical parcel once while retaining facility counts', () => {
    const { properties, valuation } = buildStateProperties([
      facility(),
      facility({
        id: 2,
        slug: 'facility-two',
        provider_name: 'Facility Two',
      }),
    ]);
    const summary = buildStateRealEstateSummary(properties, valuation);
    const holdings = buildLargestHoldings(properties);

    expect(properties).toHaveLength(1);
    expect(properties[0]).toMatchObject({
      facility_count: 2,
      related_party_facility_count: 2,
      value: 7414360,
    });
    expect(summary).toMatchObject({
      total_properties: 1,
      total_real_estate_value: 7414360,
      average_property_value: 7414360,
    });
    expect(holdings[0]).toMatchObject({
      facility_count: 2,
      related_party_count: 2,
      re_value: 7414360,
    });
  });

  it('uses unavailable values instead of fabricating zero dollars', () => {
    const { properties, valuation } = buildStateProperties([
      facility({
        realie_market_value: null,
        realie_assessed_value: null,
      }),
    ]);
    const summary = buildStateRealEstateSummary(properties, valuation);
    const highlights = buildRealEstateHighlights(summary);
    const holdings = buildLargestHoldings(properties);

    expect(summary.total_real_estate_value).toBeNull();
    expect(summary.average_property_value).toBeNull();
    expect(highlights.primary.map((item) => item.value)).toEqual([
      'N/A',
      'N/A',
    ]);
    expect(holdings[0].re_value_display).toBe('N/A');
  });

  it('does not assign a shared parcel to an arbitrary operator', () => {
    const { properties } = buildStateProperties([
      facility(),
      facility({
        id: 2,
        owner: { slug: 'different-operator', name: 'Different Operator' },
      }),
    ]);

    expect(properties[0]).toMatchObject({
      owner_name: null,
      owner_slug: null,
    });
    expect(buildLargestHoldings(properties)).toEqual([]);
  });
});
