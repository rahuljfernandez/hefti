import { formatUSD } from './stringFormatters';
import { buildFootprint } from './footprintMetrics';

/**
 * Owner-context property metrics: the Property Details tab on the owner profile.
 *
 * Deliberately separate from propertyMetrics.js. That file describes ONE
 * property (the facility context); an owner holds many, so this context is
 * list-shaped — a portfolio summary plus a list of property rows — and sharing
 * a module would only blur two different shapes together.
 *
 * Builders take an optional `source` and fall back to the mock, matching the
 * propertyMetrics convention, so call sites can pass a real payload the day the
 * endpoint lands.
 */

/* PLACEHOLDER DATA — the property API is not live yet. Numbers come from the
   design mocks, not from the owner record on the page; do not read them as live
   data in review or screenshots.

   The summary and the property list are separate mocks on purpose: the list is
   a sample of rows, while the headline counts (23 properties, 6 owners) describe
   the full portfolio the API will aggregate. Deriving the counts from the sample
   would contradict them. */

const MOCK_PORTFOLIO_SUMMARY = {
  related_party_percentage: 35,
  related_party_count: 8,
  total_properties: 23,
  portfolio_value: 125000000,
  states: ['CA', 'GA', 'TX'],
  distinct_owners: 6,
};

const MOCK_OWNER_PROPERTIES = [
  {
    id: 'craigside-15',
    facility_name: '15 Craigside',
    facility_slug: '15-craigside',
    street_address: '15 Craigside Place',
    city: 'Honolulu',
    state: 'HI',
    zip_code: '96817',
    market_value: 15000000,
    related_party: true,
    latitude: 21.3187,
    longitude: -157.8583,
  },
  {
    id: 'boulevard-se-350',
    facility_name: '350 Boulevard SE',
    facility_slug: '350-boulevard-se',
    street_address: '350 Boulevard SE',
    city: 'Atlanta',
    state: 'GA',
    zip_code: '30312',
    market_value: 35125000,
    related_party: true,
    latitude: 33.744864,
    longitude: -84.367402,
  },
  {
    id: 'oakmont-terrace',
    facility_name: 'Oakmont Terrace',
    facility_slug: 'oakmont-terrace',
    street_address: '1200 Oakmont Terrace',
    city: 'Sacramento',
    state: 'CA',
    zip_code: '95826',
    market_value: 8400000,
    related_party: false,
    latitude: 38.5449,
    longitude: -121.4014,
  },
  {
    id: 'lakeside-manor',
    facility_name: 'Lakeside Manor',
    facility_slug: 'lakeside-manor',
    street_address: '88 Lakeside Drive',
    city: 'Austin',
    state: 'TX',
    zip_code: '78733',
    market_value: 21750000,
    related_party: false,
    latitude: 30.3421,
    longitude: -97.8956,
  },
  {
    id: 'riverbend-care',
    facility_name: 'Riverbend Care Center',
    facility_slug: 'riverbend-care-center',
    street_address: '540 Riverbend Road',
    city: 'Fresno',
    state: 'CA',
    zip_code: '93720',
    market_value: 6200000,
    related_party: true,
    latitude: 36.8468,
    longitude: -119.7726,
  },
  {
    id: 'magnolia-heights',
    facility_name: 'Magnolia Heights',
    facility_slug: 'magnolia-heights',
    street_address: '77 Magnolia Street',
    city: 'Savannah',
    state: 'GA',
    zip_code: '31401',
    market_value: 12900000,
    related_party: false,
    latitude: 32.0809,
    longitude: -81.0912,
  },
];

/* Display-ready cards for the Portfolio Highlights row, split by importance:
   two `primary` headline figures (related-party risk, portfolio value) and
   three `supporting` counts. Formatting (USD, "%", "n of m") lives here; `icon`
   is a string token the organism maps to a component so this module stays free
   of JSX. */
export function buildPortfolioHighlights(source = MOCK_PORTFOLIO_SUMMARY) {
  const summary = source ?? MOCK_PORTFOLIO_SUMMARY;
  const {
    related_party_percentage,
    related_party_count,
    total_properties,
    portfolio_value,
    distinct_owners,
  } = summary;
  const states = summary.states ?? [];

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
      caption: 'Possible related party owned',
      accent: 'amber',
      icon: 'warning',
    },
    {
      id: 'portfolio-value',
      label: 'Portfolio Value',
      value: formatUSD(portfolio_value),
      caption: 'Total market value',
    },
  ];

  const supporting = [
    {
      id: 'states',
      label: 'States',
      value: states.length,
      caption: states.join(', '),
    },
    {
      id: 'properties',
      label: 'Properties',
      value: total_properties ?? 'N/A',
      caption: 'Real estate parcels',
    },
    {
      id: 'property-owners',
      label: 'Property Owners',
      value: distinct_owners ?? 'N/A',
      caption: 'Distinct landlord entities',
    },
  ];

  return { primary, supporting };
}

/* Map-ready footprint for the owner's properties — one marker per property with
   coordinates, plus the box the map fits on load. The lat/lng shaping is shared
   with the state context in footprintMetrics.js; this wrapper only supplies the
   owner mock default. */
export function buildOwnerFootprint(source = MOCK_OWNER_PROPERTIES) {
  return buildFootprint(source);
}

/* The owner's property rows, used by both the footprint map and the Properties
   list. Rows carry a preformatted `market_value_display` so the card renders
   without reaching for a formatter. */
export function buildOwnerProperties(source = MOCK_OWNER_PROPERTIES) {
  const properties = Array.isArray(source) ? source : [];
  return properties.map((property) => ({
    ...property,
    market_value_display: Number.isFinite(property.market_value)
      ? formatUSD(property.market_value)
      : 'N/A',
  }));
}

/* Filter options for the Properties list. The option arrays feed the SelectMenu
   controls and `selectOwnerProperties` reads the same values, so the dropdowns
   and the logic stay one source of truth. Sort reuses SelectMenu's built-in
   'asc'/'desc' options — the only sortable figure the cards show is market value,
   which those defaults already cover. */
export const OWNER_PROPERTY_RELATED_PARTY_OPTIONS = [
  { label: 'Related Party', value: 'related' },
  { label: 'Not Related Party', value: 'not-related' },
];

export const OWNER_PROPERTY_VALUE_OPTIONS = [
  { label: 'Over $20M', value: 'over-20m' },
  { label: '$10M – $20M', value: '10m-20m' },
  { label: 'Under $10M', value: 'under-10m' },
];

const VALUE_BUCKETS = {
  'over-20m': (v) => v > 20_000_000,
  '10m-20m': (v) => v >= 10_000_000 && v <= 20_000_000,
  'under-10m': (v) => v < 10_000_000,
};

/* A non-finite market value sorts as 0 (same rows the value filter would drop),
   so the comparator can't return NaN and scramble the whole order. */
const marketValueKey = (row) =>
  Number.isFinite(row.market_value) ? row.market_value : 0;

/* Filters then sorts the display rows for the Properties list. Each argument is
   an option value or null ("no selection"); unrecognized values are ignored so a
   stale control can't blank the list. Returns a new array — never mutates rows. */
export function selectOwnerProperties(
  rows,
  { sort, relatedParty, value } = {},
) {
  let result = rows;

  if (relatedParty === 'related') {
    result = result.filter((r) => r.related_party);
  } else if (relatedParty === 'not-related') {
    result = result.filter((r) => !r.related_party);
  }

  const inBucket = VALUE_BUCKETS[value];
  if (inBucket) {
    result = result.filter(
      (r) => Number.isFinite(r.market_value) && inBucket(r.market_value),
    );
  }

  if (sort === 'desc') {
    result = [...result].sort(
      (a, b) => marketValueKey(b) - marketValueKey(a),
    );
  } else if (sort === 'asc') {
    result = [...result].sort(
      (a, b) => marketValueKey(a) - marketValueKey(b),
    );
  }

  return result;
}
