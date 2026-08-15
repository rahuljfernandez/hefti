import { formatUSD } from './stringFormatters';

/**
 * Property metrics config and builders for the Property Details tab.
 *
 * Config arrays declare label, source key, and format; a shared reducer turns
 * any config + source into display-ready rows; builders name which config feeds
 * which section.
 */

/* Returns null — not NaN or 0 — for non-numeric input, so callers can tell
   "not a number" from "the number zero" and fall back to the raw text rather
   than inventing a figure. */
function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;

  const cleaned = value.replace(/[$,\s]/g, '');
  if (cleaned === '') return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/* Both numeric formats go through toNumber so they coerce identically —
   otherwise a source that sends strings renders 'N/A' in one column and a
   formatted value in the next. */
function formatFieldValue(value, format) {
  if (value === null || value === undefined || value === '') return 'N/A';

  switch (format) {
    case 'currency': {
      const amount = toNumber(value);
      return amount === null ? String(value) : formatUSD(amount);
    }
    case 'number': {
      const amount = toNumber(value);
      return amount === null ? String(value) : amount.toLocaleString('en-US');
    }
    case 'boolean':
      return value ? 'True' : 'False';
    default:
      return value;
  }
}

function buildFields(config, source) {
  return config.map(({ label, valueKey, format }) => ({
    label,
    value: formatFieldValue(source?.[valueKey], format),
  }));
}

const propertyHighlightsConfig = [
  { label: 'Owner Name', valueKey: 'display_owner_name' },
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

/* `asOfKey` drives the "As of {year}" caption, per-card because each figure is
   dated independently. These fields appear again in the Financial Information
   disclosure below and must keep the same format there. */
const keyFinancialStatsConfig = [
  {
    label: 'Transfer Price',
    valueKey: 'transfer_price',
    asOfKey: 'transfer_price_year',
    format: 'currency',
  },
  {
    label: 'Assessed Value',
    valueKey: 'assessed_value_highlight',
    asOfKey: 'assessed_value_highlight_year',
    format: 'currency',
  },
  {
    label: 'Market Value',
    valueKey: 'market_value_highlight',
    asOfKey: 'market_value_highlight_year',
    format: 'currency',
  },
];

/* Values stay in canonical case; the tab's caps come from FieldGrid's
   valueClassName. See fieldGrid.jsx. */
const locationFieldsConfig = [
  { label: 'Address', valueKey: 'address' },
  { label: 'Street Name', valueKey: 'street_name' },
  { label: 'State', valueKey: 'state' },
  { label: 'County', valueKey: 'county' },
  { label: 'City', valueKey: 'city' },
  { label: 'Zip Code', valueKey: 'zip_code' },
  { label: 'Latitude', valueKey: 'latitude' },
  { label: 'Longitude', valueKey: 'longitude' },
  { label: 'Parcel Number', valueKey: 'parcel_number' },
  { label: 'Jurisdiction', valueKey: 'jurisdiction' },
];

/* The left/right split is editorial, not computed — the mocks pair values with
   their year/unit counterpart across the divider. Don't try to derive it from a
   single list; uneven columns are expected. */
const propertyDetailSectionsConfig = [
  {
    title: 'Financial Information',
    left: [
      { label: 'Tax Value', valueKey: 'tax_value', format: 'currency' },
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
   sites can pass a real property object the day the endpoint lands. */

export function buildPropertyHighlights(source) {
  return buildFields(propertyHighlightsConfig, source);
}

export function buildKeyFinancialsMeta(source) {
  return buildFields(keyFinancialsMetaConfig, source);
}

export function buildKeyFinancialStats(source) {
  return keyFinancialStatsConfig.map(({ label, valueKey, asOfKey, format }) => {
    const asOf = source?.[asOfKey];
    return {
      label,
      value: formatFieldValue(source?.[valueKey], format),
      caption: asOf ? `As of ${asOf}` : null,
    };
  });
}

export function buildLocationFields(source) {
  return buildFields(locationFieldsConfig, source);
}

/* Separate from the address field list because the map needs raw numbers, not
   formatted display strings. */
export function buildLocationCoordinates(source) {
  console.log(source);
  const latitude = toNumber(source?.latitude);
  const longitude = toNumber(source?.longitude);
  if (latitude === null || longitude === null) return null;

  return { position: [latitude, longitude], label: source?.address ?? '' };
}

/* The two banner conditions, resolved here rather than in the components so the
   thresholds live next to the data they read. Both return an array and the
   banners render on length, so "no flag" and "no data" collapse to one case.

   Associated properties are only worth showing when there is something to
   switch between — a facility with a single property is the norm, not a flag. */
export function buildRelatedPartyMatches(source) {
  return source?.related_party_matches ?? [];
}

export function buildAssociatedProperties(source) {
  const properties = source?.associated_properties ?? [];
  return properties.length > 1 ? properties : [];
}

export function buildPropertyDetailSections(source) {
  return propertyDetailSectionsConfig.map(({ title, left, right }) => ({
    title,
    left: buildFields(left, source),
    right: buildFields(right, source),
  }));
}
