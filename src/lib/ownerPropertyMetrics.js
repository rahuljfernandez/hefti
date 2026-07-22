import { formatUSD } from './stringFormatters';

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

/* Headline stats for Portfolio Highlights. Returns the raw summary. */
export function buildPortfolioSummary(source = MOCK_PORTFOLIO_SUMMARY) {
  return source ?? MOCK_PORTFOLIO_SUMMARY;
}

/* Display-ready cards for the Portfolio Highlights row: two lead `emphasis`
   cards and three plain `stats` cards. Formatting (USD, "%", "n of m") lives
   here; `icon` is a string token the organism maps to a component so this
   module stays free of JSX. */
export function buildPortfolioHighlights(source = MOCK_PORTFOLIO_SUMMARY) {
  const summary = source ?? MOCK_PORTFOLIO_SUMMARY;
  const {
    related_party_percentage,
    related_party_count,
    total_properties,
    portfolio_value,
    states = [],
    distinct_owners,
  } = summary;

  const emphasis = [
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
      description: 'Possible related party owned',
      accent: 'amber',
      icon: 'warning',
    },
    {
      id: 'portfolio-value',
      label: 'Portfolio Value',
      value: portfolio_value != null ? formatUSD(portfolio_value) : 'N/A',
      description: 'Total market value',
    },
  ];

  const stats = [
    {
      id: 'states',
      label: 'States',
      value: states.length || 'N/A',
      description: states.join(', '),
    },
    {
      id: 'properties',
      label: 'Properties',
      value: total_properties ?? 'N/A',
      description:
        total_properties != null ? `Across ${total_properties} facilities` : '',
    },
    {
      id: 'property-owners',
      label: 'Property Owners',
      value: distinct_owners ?? 'N/A',
      description: 'Distinct landlord entities',
    },
  ];

  return { emphasis, stats };
}

/* The owner's property rows, used by both the footprint map and the Properties
   list. Rows carry a preformatted `market_value_display` so the card renders
   without reaching for a formatter. */
export function buildOwnerProperties(source = MOCK_OWNER_PROPERTIES) {
  const properties = source ?? [];
  return properties.map((property) => ({
    ...property,
    market_value_display:
      property.market_value != null ? formatUSD(property.market_value) : 'N/A',
  }));
}
