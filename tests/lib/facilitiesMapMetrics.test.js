import { describe, expect, it } from 'vitest';
import {
  buildFacilitiesMap,
  ownershipBucket,
  starDimensionFor,
} from '../../src/lib/facilitiesMapMetrics';

/* Ownership strings are spelled as the facilities feed ships them — mixed case,
   "Non profit" as two words. See ownershipBucket's comment. */
const facility = (overrides) => ({
  id: '1',
  slug: 'f',
  provider_name: 'Home',
  city: 'Providence',
  latitude: 41.8,
  longitude: -71.4,
  overall_rating: 3,
  health_inspection_rating: 3,
  staffing_rating: 5,
  quality_rating: 2,
  ownership_type: 'For profit - Corporation',
  operating_margin: 1,
  ...overrides,
});

describe('ownershipBucket', () => {
  it('buckets the feed spellings, which are not the ALL-CAPS ones in getBadgeColor', () => {
    expect(ownershipBucket('For profit - Limited Liability company')).toBe(
      'for_profit',
    );
    expect(ownershipBucket('Non profit - Church related')).toBe('nonprofit');
    expect(ownershipBucket('NONPROFIT - CORPORATION')).toBe('nonprofit');
    expect(ownershipBucket('Government - Hospital district')).toBe('government');
  });

  it('returns null rather than a bucket for missing or unrecognized types', () => {
    expect(ownershipBucket(null)).toBeNull();
    expect(ownershipBucket('Something else')).toBeNull();
  });
});

describe('starDimensionFor', () => {
  it('follows the active color-by dimension', () => {
    expect(starDimensionFor('Staffing')).toEqual({
      label: 'Staffing',
      column: 'staffing_rating',
    });
  });

  it('falls back to Overall for Financial, which has no star levels', () => {
    expect(starDimensionFor('Financial')).toEqual({
      label: 'Overall',
      column: 'overall_rating',
    });
  });
});

describe('buildFacilitiesMap', () => {
  const facilities = [
    facility({ id: '1', staffing_rating: 5, overall_rating: 3 }),
    facility({
      id: '2',
      staffing_rating: 1,
      overall_rating: 5,
      ownership_type: 'Government - County',
    }),
    facility({
      id: '3',
      staffing_rating: 5,
      overall_rating: 1,
      ownership_type: 'Non profit - Other',
    }),
  ];

  it('narrows on the dimension being colored, not always on overall', () => {
    const byStaffing = buildFacilitiesMap(facilities, {
      colorBy: 'Staffing',
      starRating: '5',
    });
    expect(byStaffing.markers.map((m) => m.id)).toEqual(['1', '3']);

    const byOverall = buildFacilitiesMap(facilities, {
      colorBy: 'Overall',
      starRating: '5',
    });
    expect(byOverall.markers.map((m) => m.id)).toEqual(['2']);
  });

  it('keeps the star filter on overall when coloring by Financial', () => {
    const result = buildFacilitiesMap(facilities, {
      colorBy: 'Financial',
      starRating: '5',
    });
    expect(result.markers.map((m) => m.id)).toEqual(['2']);
  });

  it('intersects the star and ownership filters', () => {
    const result = buildFacilitiesMap(facilities, {
      colorBy: 'Staffing',
      starRating: '5',
      ownership: 'nonprofit',
    });
    expect(result.markers.map((m) => m.id)).toEqual(['3']);
    expect(result.shownCount).toBe(1);
    expect(result.totalCount).toBe(3);
  });

  /* A facility the API has no coordinates for still exists in the state, so it
     has to stay in the counts rather than silently vanishing from the total. */
  it('counts facilities it cannot plot instead of dropping them', () => {
    const result = buildFacilitiesMap([
      ...facilities,
      facility({ id: '4', latitude: null, longitude: null }),
    ]);
    expect(result.markers).toHaveLength(3);
    expect(result.shownCount).toBe(4);
    expect(result.totalCount).toBe(4);
    expect(result.unmappedCount).toBe(1);
  });

  it('reports the year the margins came from so the map can disclose the lag', () => {
    const result = buildFacilitiesMap(facilities, {
      colorBy: 'Financial',
      financial: { year: 2021, isFallback: true },
    });
    expect(result).toMatchObject({
      isFinancial: true,
      financialYear: 2021,
      isFallback: true,
      valueLabel: 'Operating margin',
    });
    expect(result.legend).not.toBeNull();
  });

  /* react-leaflet only re-applies marker style through `pathOptions`, and only
     when that object's identity changes. Carrying the fill there — rather than
     as a loose fillColor prop — is what makes switching Color-by actually
     recolor an already-mounted map. */
  it('recolors the same facility when the color-by dimension changes', () => {
    const one = [facility({ overall_rating: 1, staffing_rating: 5 })];
    const overall = buildFacilitiesMap(one, { colorBy: 'Overall' });
    const staffing = buildFacilitiesMap(one, { colorBy: 'Staffing' });

    expect(overall.markers[0].pathOptions.fillColor).not.toBe(
      staffing.markers[0].pathOptions.fillColor,
    );
    expect(overall.markers[0].valueText).toBe('1 star');
    expect(staffing.markers[0].valueText).toBe('5 stars');
  });

  it('colors a facility with no value for the active dimension as no-data', () => {
    const [marker] = buildFacilitiesMap(
      [facility({ overall_rating: null })],
      { colorBy: 'Overall' },
    ).markers;
    expect(marker.valueText).toBe('No data');
  });
});
