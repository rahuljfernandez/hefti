import { formatUSD } from './stringFormatters';

/**
 * State-context real estate metrics: the Real Estate tab on the state profile.
 *
 * Kept separate from ownerPropertyMetrics.js and propertyMetrics.js — each
 * describes a different subject (an owner's portfolio, one facility's property,
 * a state's aggregate real estate). Sharing a module would only blur shapes that
 * happen to look alike today.
 *
 * Builders take an optional `source` and fall back to the mock, matching the
 * other property modules, so call sites can pass a real payload the day the
 * endpoint lands.
 */

/* PLACEHOLDER DATA — the state real estate API is not live yet. Numbers come
   from the design mocks, not from the state record on the page; do not read them
   as live data in review or screenshots. */

const MOCK_REAL_ESTATE_SUMMARY = {
  related_party_percentage: 60,
  related_party_count: 174,
  total_properties: 288,
  total_real_estate_value: 1125000000,
  average_property_value: 3906150,
  operators_involved: 42,
  property_owners: 58,
};

/* Display-ready cards for the Real Estate Highlights row, split by importance:
   two `primary` headline figures (related-party risk, total value) over three
   `supporting` counts. Formatting (USD, "%", "n of m") lives here; `icon` is a
   string token the grid maps to a component so this module stays free of JSX. */
export function buildRealEstateHighlights(source = MOCK_REAL_ESTATE_SUMMARY) {
  const summary = source ?? MOCK_REAL_ESTATE_SUMMARY;
  const {
    related_party_percentage,
    related_party_count,
    total_properties,
    total_real_estate_value,
    average_property_value,
    operators_involved,
    property_owners,
  } = summary;

  const primary = [
    {
      id: 'related-party',
      label: 'Related Party',
      value:
        related_party_percentage != null
          ? `${related_party_percentage}%`
          : 'N/A',
      aside:
        related_party_count != null && total_properties != null
          ? `${related_party_count} of ${total_properties}`
          : null,
      caption: 'Possible related party owned properties',
      accent: 'amber',
      icon: 'warning',
    },
    {
      id: 'total-real-estate-value',
      label: 'Total Real Estate Value',
      value: formatUSD(total_real_estate_value),
      caption: 'Total market value',
    },
  ];

  const supporting = [
    {
      id: 'average-property-value',
      label: 'Average Property Value',
      value: formatUSD(average_property_value),
      caption: 'Total market value / total properties',
    },
    {
      id: 'operators-involved',
      label: 'Operators Involved',
      value: operators_involved ?? 'N/A',
      caption: 'Distinct operating entities',
    },
    {
      id: 'property-owners',
      label: 'Property Owners',
      value: property_owners ?? 'N/A',
      caption: 'Distinct landlord entities',
    },
  ];

  return { primary, supporting };
}

/* No facility coordinates yet — the footprint is a blank map on purpose (the API
   isn't live). An empty list yields no markers, so the map falls back to its
   continental-US view. The builder still maps records the way the owner one does
   so it works unchanged the day the endpoint returns the state's facilities. */
const MOCK_STATE_FACILITIES = [];

/* Map-ready footprint for the state's facilities: one marker per facility with
   coordinates, plus the [[minLat,minLng],[maxLat,maxLng]] box the map fits on
   load (null when nothing has coordinates). Mirrors buildOwnerFootprint so the
   shared PropertyFootprint renders it without any state-specific branch. */
export function buildStateFootprint(source = MOCK_STATE_FACILITIES) {
  const facilities = Array.isArray(source) ? source : [];
  const markers = facilities
    .filter((f) => Number.isFinite(f.latitude) && Number.isFinite(f.longitude))
    .map((f) => ({
      id: f.id,
      position: [f.latitude, f.longitude],
      label: f.facility_name,
      relatedParty: Boolean(f.related_party),
    }));

  const bounds = markers.reduce((box, { position: [lat, lng] }) => {
    if (box === null) {
      return [
        [lat, lng],
        [lat, lng],
      ];
    }
    return [
      [Math.min(box[0][0], lat), Math.min(box[0][1], lng)],
      [Math.max(box[1][0], lat), Math.max(box[1][1], lng)],
    ];
  }, null);

  return {
    markers,
    bounds,
    relatedPartyCount: markers.filter((m) => m.relatedParty).length,
    totalCount: markers.length,
  };
}
