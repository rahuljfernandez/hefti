import { formatUSD } from './stringFormatters';
import { buildFootprint } from './footprintMetrics';

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

/* Map-ready footprint for the state's facilities. Shares its lat/lng shaping
   with the owner context via footprintMetrics.js; this wrapper only supplies the
   state mock, which is empty on purpose — no coordinates yet, so the map falls
   back to its continental-US view and works unchanged once the endpoint returns
   the state's facilities. */
export function buildStateFootprint(source = MOCK_STATE_FACILITIES) {
  return buildFootprint(source);
}

const MOCK_LARGEST_HOLDINGS = [
  {
    id: 'snf-care-centers',
    owner_name: 'SNF Care Centers LLC',
    owner_slug: 'snf-care-centers-llc',
    facility_count: 5,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 160520100,
  },
  {
    id: 'commonwealth-senior-living',
    owner_name: 'Commonwealth Senior Living Grp',
    owner_slug: 'commonwealth-senior-living-grp',
    facility_count: 11,
    related_party_count: 9,
    related_party_total: 11,
    re_value: 140520100,
  },
  {
    id: 'dominion-care-holdings',
    owner_name: 'Dominion Care Holdings LLC',
    owner_slug: 'dominion-care-holdings-llc',
    facility_count: 8,
    related_party_count: 8,
    related_party_total: 8,
    re_value: 120520100,
  },
  {
    id: 'saber-healthcare-holdings',
    owner_name: 'Saber Healthcare Holdings LLC',
    owner_slug: 'saber-healthcare-holdings-llc',
    facility_count: 8,
    related_party_count: 23,
    related_party_total: 30,
    re_value: 110520100,
  },
  {
    id: 'piedmont-operating-partners',
    owner_name: 'Piedmont Operating Partners LLC',
    owner_slug: 'piedmont-operating-partners-llc',
    facility_count: 8,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 16520100,
  },
  {
    id: 'valley-health-services',
    owner_name: 'Valley Health Services',
    owner_slug: 'valley-health-services',
    facility_count: 8,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 16520100,
  },
  {
    id: 'beach-health-services',
    owner_name: 'Beach Health Services',
    owner_slug: 'beach-health-services',
    facility_count: 8,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 16520100,
  },
  {
    id: 'alter-tzvi',
    owner_name: 'Alter, Tzvi',
    owner_slug: 'alter-tzvi',
    facility_count: 4,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 16520100,
  },
  {
    id: 'wwbv-holdings',
    owner_name: 'Wwbv Holdings LLC',
    owner_slug: 'wwbv-holdings-llc',
    facility_count: 6,
    related_party_count: 5,
    related_party_total: 5,
    re_value: 16520100,
  },
];

/* Display-ready rows for the Largest Related-Party Holdings table. Attaches a
   preformatted facility label and USD value so the table cells render without
   reaching for a formatter, matching buildOwnerProperties in the owner context. */
export function buildLargestHoldings(source = MOCK_LARGEST_HOLDINGS) {
  const holdings = Array.isArray(source) ? source : [];
  return holdings.map((holding) => ({
    ...holding,
    facility_label: `${holding.facility_count} facilities`,
    re_value_display: formatUSD(holding.re_value),
  }));
}
