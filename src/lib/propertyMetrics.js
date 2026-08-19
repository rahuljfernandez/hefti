import { formatDateOnly, formatUSD } from './stringFormatters';
import { toTitleCase } from './toTitleCase';

/**
 * Property metrics config and builders for the Property Details tab.
 *
 * Config arrays declare label, source key, and format; a shared helper turns
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
   — while the design shows its parts as separate rows. Split from right to left
   so commas in street and suite details do not shift the city/state fields. */
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

function formatAddress({ street, city, state, zip }) {
  const cityState = [
    city ? toTitleCase(city) : null,
    [state?.toUpperCase(), zip].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');

  return [street ? toTitleCase(street) : null, cityState]
    .filter(Boolean)
    .join(', ');
}

/* Owner mailing arrives space-delimited — "1000 GATES AVE STE 5 BROOKLYN NY
   11221" — not comma-delimited like the parcel address above. Only the trailing
   state and ZIP are unambiguous; nothing marks where the street ends and a
   one-to-three-word city begins, so the head is kept whole rather than guessed
   at. */
function parseOwnerMailing(mailing) {
  if (typeof mailing !== 'string' || mailing.trim() === '') return {};

  const trimmed = mailing.trim();
  const [, head, state, zip] =
    trimmed.match(/^(.*?)\s+([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/) ?? [];

  if (!state) return { line: trimmed };

  return { line: head, state: state.toUpperCase(), zip };
}

/* Realie leaves the date columns non-NULL and writes a stray non-UTF-8 byte instead —
   40% of realie_last_transfer_date, 38% of realie_ownership_start — so an emptiness
   check passes it through and the tab renders the raw byte as a date. */
const HAS_CONTENT = /[A-Za-z0-9]/;

/* Numeric formats go through toNumber so they coerce identically —
   otherwise a source that sends strings renders 'N/A' in one column and a
   formatted value in the next. */
function formatFieldValue(value, format) {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'string' && !HAS_CONTENT.test(value)) return 'N/A';

  switch (format) {
    case 'currency': {
      const amount = toNumber(value);
      return amount === null ? String(value) : formatUSD(amount);
    }
    case 'number': {
      const amount = toNumber(value);
      return amount === null ? String(value) : amount.toLocaleString('en-US');
    }
    case 'date':
      return formatDateOnly(value);
    case 'title':
      return typeof value === 'string' ? toTitleCase(value) : value;
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
  { label: 'Owner Name', valueKey: 'realie_owner_name', format: 'title' },
  {
    label: 'Owner Mailing Address',
    valueKey: 'owner_mailing_address',
    format: 'title',
  },
  { label: 'Owner State', valueKey: 'owner_state' },
  { label: 'Owner Zip Code', valueKey: 'owner_zip_code' },
  {
    label: 'Owner Entity Type',
    valueKey: 'realie_owner_entity_type',
    format: 'title',
  },
  /* Counts parcels held under the Realie titleholder name, not facilities under the
     CMS owner — the two are the same entity only when the titleholder does not
     differ. */
  {
    label: 'Owner Parcel Count',
    valueKey: 'realie_owner_parcel_count',
    format: 'number',
  },
  {
    label: 'Ownership Start',
    valueKey: 'realie_ownership_start',
    format: 'date',
  },
  {
    label: 'Official Description',
    valueKey: 'realie_use_desc',
    format: 'title',
  },
  { label: 'Use Code', valueKey: 'realie_use_code' },
];

const keyFinancialsMetaConfig = [
  {
    label: 'Most Recent Transfer Date',
    valueKey: 'realie_last_transfer_date',
    format: 'date',
  },
  {
    label: 'Transfer Price',
    valueKey: 'realie_last_transfer_price',
    format: 'currency',
  },
  {
    label: 'Transfer Doc Type',
    valueKey: 'realie_transfer_doc_type',
    format: 'title',
  },
  {
    label: 'Last Grantee',
    valueKey: 'realie_last_grantee',
    format: 'title',
  },
  {
    label: 'Prior Transfers',
    valueKey: 'realie_n_prior_transfers',
    format: 'number',
  },
  {
    label: 'Lender Name',
    valueKey: 'realie_lender_name',
    format: 'title',
  },
  {
    label: 'Lien Balance',
    valueKey: 'realie_lien_balance',
    format: 'currency',
  },
  { label: 'Lien Count', valueKey: 'realie_lien_count', format: 'number' },
  {
    label: 'Estimated Equity',
    valueKey: 'realie_equity_est',
    format: 'currency',
  },
  /* Last so they sit against the stat cards below, which carry the assessment year;
     between the transfer and lender rows they read as dated by the transfer. */
  {
    label: 'Assessed Value',
    valueKey: 'realie_assessed_value',
    format: 'currency',
  },
  /* A dollar amount owed, not a valuation — it runs 1.6% of market value at the
     median. "Tax Value" reads as a basis, which is what the column name suggests
     and what it is not. */
  {
    label: 'Annual Property Tax',
    valueKey: 'realie_tax_value',
    format: 'currency',
  },
  { label: 'Property Tax Year', valueKey: 'realie_tax_year' },
];

/* Market value is exactly building + land in every county that reports all three, so
   these three read as a whole and its parts. Assessed value is deliberately not here:
   states assess at statutory fractions of market — 6% in SC, 11% in OK, 100% in TX —
   so it cannot sit beside these without implying a comparison that does not hold.

   All three come off one county assessment and share its year; `asOfKey` stays
   per-card for the day a figure carries its own date. */
const keyFinancialStatsConfig = [
  {
    label: 'Market Value',
    valueKey: 'realie_market_value',
    asOfKey: 'realie_assessed_year',
    format: 'currency',
  },
  {
    label: 'Building Value',
    valueKey: 'realie_building_value',
    asOfKey: 'realie_assessed_year',
    format: 'currency',
  },
  {
    label: 'Land Value',
    valueKey: 'realie_land_value',
    asOfKey: 'realie_assessed_year',
    format: 'currency',
  },
];

const locationFieldsConfig = [
  { label: 'Facility Address', valueKey: 'street_address', format: 'title' },
  { label: 'Parcel Address', valueKey: 'parcel_address' },
  { label: 'Facility City', valueKey: 'city', format: 'title' },
  { label: 'Facility State', valueKey: 'state' },
  { label: 'Facility Zip Code', valueKey: 'zip_code' },
  { label: 'Parcel County', valueKey: 'realie_county', format: 'title' },
  { label: 'Parcel Number', valueKey: 'realie_parcel_id' },
  { label: 'Year Built', valueKey: 'realie_year_built' },
  { label: 'Acres', valueKey: 'realie_acres', format: 'number' },
  {
    label: 'Building Area',
    valueKey: 'realie_building_area',
    format: 'number',
  },
  { label: 'Facility Latitude', valueKey: 'latitude' },
  { label: 'Facility Longitude', valueKey: 'longitude' },
];

/* Data builders read the facility record, where Realie parcel fields are
   flattened; missing source fields are formatted as "N/A". */

/* The owner rows are derived, not read off the record, so the config keeps one
   key per row like every other section.

   Unlike buildLocationFields, these deliberately do not fall back to the
   facility's own address columns: the owner mails elsewhere on ~80% of parcels,
   so a fallback would present the facility as the owner's address. */
export function buildPropertyHighlights(source) {
  const { line, state, zip } = parseOwnerMailing(source?.realie_owner_mailing);

  return buildFields(propertyHighlightsConfig, {
    ...source,
    owner_mailing_address: line,
    owner_state: state,
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

export function buildLocationFields(source) {
  const parcelAddress = formatAddress(
    parseRealieAddress(source?.realie_address),
  );

  return buildFields(locationFieldsConfig, {
    ...source,
    parcel_address: parcelAddress,
  });
}

/* CMS supplies the facility coordinates, so the map label uses the matching CMS
   address rather than implying that the pin locates the Realie parcel. */
export function buildLocationCoordinates(source) {
  const latitude = toNumber(source?.latitude);
  const longitude = toNumber(source?.longitude);
  if (latitude === null || longitude === null) return null;

  return {
    position: [latitude, longitude],
    label: formatAddress({
      street: source?.street_address,
      city: source?.city,
      state: source?.state,
      zip: source?.zip_code,
    }),
  };
}

/* Banner data is resolved here rather than in the components so ownership
   matching and parcel-availability rules stay next to the records they read. */

/* Realie's first coverage year; every earlier year returns a facility with no
   parcel columns at all. */
export const PROPERTY_DATA_START_YEAR = 2026;

/* The parcel id is the match itself — a facility that matched has one, and the
   ~29% that did not have every other Realie column empty too. HAS_CONTENT rather
   than an emptiness check because of the stray bytes noted above. */
export function hasPropertyData(source) {
  const parcelId = source?.realie_parcel_id;
  if (parcelId === null || parcelId === undefined) return false;
  return HAS_CONTENT.test(String(parcelId));
}

/* Realie ships the parcel titleholder into facility_ownership_links as a synthetic
   entity under this role; it is the only link the flag can name, so the row points
   there. */
const TITLEHOLDER_ROLE = 'PROPERTY TITLEHOLDER (REALIE)';

/* Realie's flag asks whether the titleholder's name *differs* from the CMS owner's, so
   FALSE is the related-party case: the operator holds its own title. Anything other than
   an explicit FALSE — including the empty value on the ~29% of facilities with no parcel
   — leaves the banner off. */
function isRelatedParty(source) {
  const value = source?.realie_titleholder_differs;
  if (typeof value === 'boolean') return value === false;
  if (typeof value !== 'string') return false;
  return /^(false|no|0)$/i.test(value.trim());
}

/* Null when the flag is off, so the banner has one falsy check and one shape — the
   buildLocationCoordinates pattern. The titleholder lookup is only here to name and
   link the entity; the flag alone carries no identity. */
export function buildRelatedPartyFlag(source) {
  if (!isRelatedParty(source)) return null;

  const titleholder = (source?.facility_ownership_links ?? []).find(
    (link) => link.cms_ownership_role === TITLEHOLDER_ROLE,
  );

  const name =
    titleholder?.ownership_entity?.cms_ownership_name ??
    source?.realie_owner_name;
  if (!name) return null;

  return {
    entity_name: toTitleCase(name),
    entity_slug: titleholder?.ownership_entity?.slug,
    cms_ownership_role: titleholder?.cms_ownership_role,
  };
}
