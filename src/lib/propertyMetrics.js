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

/* Realie ships the address as one string — "15 CRAIGSIDE PL, HONOLULU, HI 96817"
   — where the design wants the parts as separate rows.

   splits the address string from right to left instead of traditional left to right.  This handles the case of suites numbers being attached to an address. */
function parseRealieAddress(address) {
  if (typeof address !== 'string' || address.trim() === '') return {};

  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const [, state, zip] =
    parts.at(-1)?.match(/^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/) ?? [];

  if (!state) return { street: parts.join(', ') };

  /* A handful of parcels omit the city segment, so the trailing "ST ZIP" is what
     anchors the split, not the comma count. */
  return {
    street: parts.slice(0, parts.length > 2 ? -2 : -1).join(', '),
    city: parts.length > 2 ? parts.at(-2) : undefined,
    state: state.toUpperCase(),
    zip,
  };
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
    case 'percent': {
      const amount = toNumber(value);
      return amount === null ? String(value) : `${amount.toFixed(1)}%`;
    }
    /* Realie sends these as the strings "TRUE"/"FALSE", and every non-empty
       string is truthy. */
    case 'boolean': {
      const truthy =
        typeof value === 'string'
          ? /^(true|yes|1)$/i.test(value.trim())
          : Boolean(value);
      return truthy ? 'True' : 'False';
    }
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
  { label: 'Owner Name', valueKey: 'realie_owner_name' },
  { label: 'Owner Address', valueKey: 'owner_address' },
  { label: 'Owner City, State', valueKey: 'owner_city_state' },
  { label: 'Owner Zip Code', valueKey: 'owner_zip_code' },
  { label: 'Official Description', valueKey: 'realie_use_desc' },
  { label: 'Use Code', valueKey: 'realie_use_code' },
];

const keyFinancialsMetaConfig = [
  { label: 'Most Recent Transfer Date', valueKey: 'realie_last_transfer_date' },
  { label: 'LTV', valueKey: 'realie_ltv' },
];

/* `asOfKey` drives the "As of {year}" caption, per-card because each figure is
   dated independently. These fields appear again in the Financial Information
   disclosure below and must keep the same format there. */
const keyFinancialStatsConfig = [
  {
    label: 'Transfer Price',
    valueKey: 'realie_last_transfer_price',
    asOfKey: 'realie_last_transfer_date',
    format: 'currency',
  },
  {
    label: 'Assessed Value',
    valueKey: 'realie_assessed_value',
    asOfKey: 'realie_assessed_year',
    format: 'currency',
  },
  {
    label: 'Market Value',
    valueKey: 'realie_market_value',
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
  { label: 'County', valueKey: 'realie_county' },
  { label: 'City', valueKey: 'city' },
  { label: 'Zip Code', valueKey: 'zip_code' },
  { label: 'Latitude', valueKey: 'latitude' },
  { label: 'Longitude', valueKey: 'longitude' },
  { label: 'Parcel Number', valueKey: 'realie_parcel_id' },
  { label: 'Jurisdiction', valueKey: 'jurisdiction' },
];

/* The left/right split is editorial, not computed — the mocks pair values with
   their year/unit counterpart across the divider. Don't try to derive it from a
   single list; uneven columns are expected. */
const propertyDetailSectionsConfig = [
  {
    title: 'Financial Information',
    left: [
      { label: 'Tax Value', valueKey: 'realie_tax_value', format: 'currency' },
      {
        label: 'Market Value',
        valueKey: 'realie_market_value',
        format: 'currency',
      },
      {
        label: 'Assessed Value',
        valueKey: 'realie_assessed_value',
        format: 'currency',
      },
      {
        label: 'Current LTV Estimates Combined',
        valueKey: 'realie_ltv',
        format: 'percent',
      },
    ],
    /* One county assessment record backs all three figures — tax year and
       assessed year match on every parcel, and Realie ships no separate market
       value year. */
    right: [
      { label: 'Tax Year', valueKey: 'realie_tax_year' },
      { label: 'Market Value Year', valueKey: 'realie_assessed_year' },
      { label: 'Assessed Year', valueKey: 'realie_assessed_year' },
    ],
  },
  {
    title: 'Building Information',
    left: [
      {
        label: 'Building Area',
        valueKey: 'realie_building_area',
        format: 'number',
      },
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
      { label: 'Acres', valueKey: 'realie_acres', format: 'number' },
      { label: 'Subdivision', valueKey: 'subdivision' },
      { label: 'Site Census Tract', valueKey: 'site_census_tract' },
      { label: 'Lot Number', valueKey: 'lot_number' },
    ],
  },
];

/* Every builder takes an optional `source` and falls back to the mock, so call
   sites can pass a real property object the day the endpoint lands. */

/* The three address rows are derived, not read off the record, so the config
   keeps one key per row like every other section. */
export function buildPropertyHighlights(source) {
  const { street, city, state, zip } = parseRealieAddress(
    source?.realie_address,
  );

  const ownerCity = city ?? source?.city;

  return buildFields(propertyHighlightsConfig, {
    ...source,
    owner_address: street,
    owner_city_state: state ? `${ownerCity}, ${state}` : ownerCity,
    owner_zip_code: zip,
  });
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

/* The parcel address is the property's own; the facility's address columns cover
   the rows when no parcel matched. */
export function buildLocationFields(source) {
  const { street, city, state, zip } = parseRealieAddress(
    source?.realie_address,
  );

  return buildFields(locationFieldsConfig, {
    ...source,
    address: street ?? source?.street_address,
    city: city ?? source?.city,
    state: state ?? source?.state,
    zip_code: zip ?? source?.zip_code,
  });
}

/* Separate from the address field list because the map needs raw numbers, not
   formatted display strings. */
export function buildLocationCoordinates(source) {
  console.log(source);
  const latitude = toNumber(source?.latitude);
  const longitude = toNumber(source?.longitude);
  if (latitude === null || longitude === null) return null;

  const { street } = parseRealieAddress(source?.realie_address);
  return {
    position: [latitude, longitude],
    label: street ?? source?.street_address ?? '',
  };
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
