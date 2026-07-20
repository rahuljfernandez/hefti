import { formatUSD } from './stringFormatters';

/**
 * Property metrics config and builders for the Property Details tab.
 *
 * Pattern:
 * - Config arrays declare the label, source key, and format for each field
 * - A single shared reducer turns any config + source into display-ready rows
 * - Builders are thin wrappers naming which config feeds which section
 *
 * Sections are grouped the way the tab renders them: Property Highlights,
 * Key Financials, Location Information, and the three Property Details
 * disclosures (Financial / Building / Land).
 */

/* PLACEHOLDER DATA — the property API is not live yet.
 *
 * Every value below is hardcoded from the design mocks so the tab can be built
 * and reviewed against realistic content. Keys are named for the fields the API
 * is expected to return, so the switch-over is: pass the real property object
 * into the builders and delete this constant. None of it is derived from the
 * facility record currently on the page, and nothing here should be read as
 * live data in review or in screenshots. */
const MOCK_PROPERTY = {
  // Property Highlights
  owner_name: 'RHODES HOMES',
  owner_address: '350 BOULEVARD SE',
  owner_city_state: 'ATLANTA, GA',
  owner_zip_code: '30312',
  official_description: 'Retired, Handicap, Convalescent, Nursing Home',
  use_code: '9106',

  // Key Financials
  most_recent_transfer_date: 'MARCH 14, 2021',
  purchase_ltv: 'Private',
  transfer_price: 35125000,
  transfer_price_year: '2021',
  assessed_value_highlight: 5125000,
  assessed_value_highlight_year: '2026',
  market_value_highlight: 35125000,
  market_value_highlight_year: '2025',

  // Location Information
  address: '350 Boulevard SE',
  street_name: 'Boulevard SE',
  state: 'GA',
  county: 'FULTON',
  city: 'Atlanta',
  zip_code: '30312',
  latitude: 33.744864,
  longitude: -84.367402,
  parcel_number: '14 002100010740',
  jurisdiction: 'City of Atlanta',

  // Property Details — Financial
  tax_value: 0,
  tax_year: '2026',
  market_value: 1641050,
  market_value_year: '2025',
  assessed_value: 1641050,
  assessed_year: '2026',
  current_ltv_estimates_combined: 0,

  // Property Details — Building
  building_area: 0,
  total_bedrooms: 0,
  total_bathrooms: 0,
  pool: false,
  garage: false,
  residential: true,

  // Property Details — Land
  land_area: 26580,
  acres: 0.61,
  zoning_code: 'R-18',
  subdivision: 'Observatory Circle',
  neighborhood: '038',
  site_census_tract: '110001020.001012',
  block_number: '1299',
  lot_number: '1034',
  depth: 0,
};

/* Format dispatch for every config below. Currency defers to the shared
   formatUSD so the tab can't drift from the rest of the app's money
   formatting; 'raw' passes strings through untouched. */
function formatFieldValue(value, format) {
  if (value === null || value === undefined || value === '') return 'N/A';

  switch (format) {
    case 'currency':
      return formatUSD(value);
    case 'number':
      return Number(value).toLocaleString('en-US');
    case 'boolean':
      return value ? 'True' : 'False';
    case 'uppercase':
      return String(value).toUpperCase();
    default:
      return value;
  }
}

/* The one reducer every builder goes through — config in, display-ready
   { label, value } rows out. Keeps formatting and the missing-value fallback
   in a single place rather than repeated per section. */
function buildFields(config, source) {
  return config.map(({ label, valueKey, format }) => ({
    label,
    value: formatFieldValue(source?.[valueKey], format),
  }));
}

const propertyHighlightsConfig = [
  { label: 'Owner Name', valueKey: 'owner_name' },
  { label: 'Owner Address', valueKey: 'owner_address' },
  { label: 'Owner City, State', valueKey: 'owner_city_state' },
  { label: 'Owner Zip Code', valueKey: 'owner_zip_code' },
  { label: 'Official Description', valueKey: 'official_description' },
  { label: 'Use Code', valueKey: 'use_code' },
];

const keyFinancialsMetaConfig = [
  { label: 'Most Recent Transfer Date', valueKey: 'most_recent_transfer_date' },
  { label: 'Purchase LTV', valueKey: 'purchase_ltv' },
];

/* The three headline stat cards. `asOfKey` drives the "As of {year}" caption,
   which is per-card here because each figure is dated independently. */
const keyFinancialStatsConfig = [
  {
    label: 'Transfer Price',
    valueKey: 'transfer_price',
    asOfKey: 'transfer_price_year',
    format: 'number',
  },
  {
    label: 'Assessed Value',
    valueKey: 'assessed_value_highlight',
    asOfKey: 'assessed_value_highlight_year',
    format: 'number',
  },
  {
    label: 'Market Value',
    valueKey: 'market_value_highlight',
    asOfKey: 'market_value_highlight_year',
    format: 'number',
  },
];

/* Address parts are upcased for consistency with the Property Highlights
   fields, which the mocks show in caps. Coordinates, zip, and the parcel number
   are left alone — they carry no case to normalize. */
const locationFieldsConfig = [
  { label: 'Address', valueKey: 'address', format: 'uppercase' },
  { label: 'Street Name', valueKey: 'street_name', format: 'uppercase' },
  { label: 'State', valueKey: 'state', format: 'uppercase' },
  { label: 'County', valueKey: 'county', format: 'uppercase' },
  { label: 'City', valueKey: 'city', format: 'uppercase' },
  { label: 'Zip Code', valueKey: 'zip_code' },
  { label: 'Latitude', valueKey: 'latitude' },
  { label: 'Longitude', valueKey: 'longitude' },
  { label: 'Parcel Number', valueKey: 'parcel_number', format: 'uppercase' },
  { label: 'Jurisdiction', valueKey: 'jurisdiction', format: 'uppercase' },
];

/* Each disclosure splits into a left and right column. The split is editorial,
   not computed — the mocks pair values with their year/unit counterpart across
   the divider — so the columns are declared rather than derived from a single
   list. Uneven column lengths are expected and fine. */
const propertyDetailSectionsConfig = [
  {
    title: 'Financial Information',
    left: [
      { label: 'Tax Value', valueKey: 'tax_value', format: 'number' },
      { label: 'Market Value', valueKey: 'market_value', format: 'currency' },
      {
        label: 'Assessed Value',
        valueKey: 'assessed_value',
        format: 'currency',
      },
      {
        label: 'Current LTV Estimates Combined',
        valueKey: 'current_ltv_estimates_combined',
        format: 'number',
      },
    ],
    right: [
      { label: 'Tax Year', valueKey: 'tax_year' },
      { label: 'Market Value Year', valueKey: 'market_value_year' },
      { label: 'Assessed Year', valueKey: 'assessed_year' },
    ],
  },
  {
    title: 'Building Information',
    left: [
      { label: 'Building Area', valueKey: 'building_area', format: 'number' },
      {
        label: 'Total Bathrooms',
        valueKey: 'total_bathrooms',
        format: 'number',
      },
      { label: 'Garage', valueKey: 'garage', format: 'boolean' },
    ],
    right: [
      { label: 'Total Bedrooms', valueKey: 'total_bedrooms', format: 'number' },
      { label: 'Pool', valueKey: 'pool', format: 'boolean' },
      { label: 'Residential', valueKey: 'residential', format: 'boolean' },
    ],
  },
  {
    title: 'Land Information',
    left: [
      { label: 'Land Area', valueKey: 'land_area', format: 'number' },
      { label: 'Zoning Code', valueKey: 'zoning_code' },
      { label: 'Neighborhood', valueKey: 'neighborhood' },
      { label: 'Block Number', valueKey: 'block_number' },
      { label: 'Depth', valueKey: 'depth', format: 'number' },
    ],
    right: [
      { label: 'Acres', valueKey: 'acres' },
      { label: 'Subdivision', valueKey: 'subdivision' },
      { label: 'Site Census Tract', valueKey: 'site_census_tract' },
      { label: 'Lot Number', valueKey: 'lot_number' },
    ],
  },
];

/* Every builder takes an optional `source` and falls back to the mock, so call
   sites can already pass a real property object the day the endpoint lands
   without touching the components. */

export function buildPropertyHighlights(source = MOCK_PROPERTY) {
  return buildFields(propertyHighlightsConfig, source);
}

export function buildKeyFinancialsMeta(source = MOCK_PROPERTY) {
  return buildFields(keyFinancialsMetaConfig, source);
}

export function buildKeyFinancialStats(source = MOCK_PROPERTY) {
  return keyFinancialStatsConfig.map(
    ({ label, valueKey, asOfKey, format }) => ({
      label,
      value: formatFieldValue(source?.[valueKey], format),
      asOf: source?.[asOfKey] ?? null,
    }),
  );
}

export function buildLocationFields(source = MOCK_PROPERTY) {
  return buildFields(locationFieldsConfig, source);
}

/* Returns the map marker's position and label. Separate from the address field
   list because the map needs raw numbers, not formatted display strings. */
export function buildLocationCoordinates(source = MOCK_PROPERTY) {
  const { latitude, longitude, address } = source ?? {};
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }
  return { position: [latitude, longitude], label: address ?? '' };
}

export function buildPropertyDetailSections(source = MOCK_PROPERTY) {
  return propertyDetailSectionsConfig.map(({ title, left, right }) => ({
    title,
    left: buildFields(left, source),
    right: buildFields(right, source),
  }));
}
