import { formatUSD } from './stringFormatters';
import { toTitleCase } from './toTitleCase';
import { badgeConfig } from './getBadgeColor';

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

/* Numeric formats go through toNumber so they coerce identically —
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

/* `asOfKey` drives each card's "As of …" caption because the figures are dated
   independently. These fields appear again in the Financial Information
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

/* The left/right split is editorial, not computed. Preserve the configured
   grouping rather than deriving it from one list; uneven columns are expected. */
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

/* Data builders read the facility record, where Realie parcel fields are
   flattened; missing source fields are formatted as "N/A". */

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
  const latitude = toNumber(source?.latitude);
  const longitude = toNumber(source?.longitude);
  if (latitude === null || longitude === null) return null;

  const { street } = parseRealieAddress(source?.realie_address);
  return {
    position: [latitude, longitude],
    label: street ?? source?.street_address ?? '',
  };
}

/* Banner data is resolved here rather than in the components so ownership
   matching and parcel-availability rules stay next to the records they read. */

/* Realie ships the parcel titleholder into facility_ownership_links as a synthetic
   entity under this role, so it has to come out of the CMS network before the
   titleholder can be compared against it — otherwise every parcel self-matches. */
const TITLEHOLDER_ROLE = 'PROPERTY TITLEHOLDER (REALIE)';

/* CMS and Realie punctuate the same entity differently — "CROSSROADS EAST REALTY, LLC"
   against "CROSSROADS EAST REALTY LLC" — so names only compare once punctuation and
   corporate suffixes come off. */
const ENTITY_SUFFIXES = /\b(?:LLC|INC|LP|LLP|LTD|CO|CORP|COMPANY|TR|THE)\b/g;

function normalizeEntityName(value) {
  if (typeof value !== 'string') return '';

  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(ENTITY_SUFFIXES, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Ranked by badgeConfig's key order so the row surfaces a role that renders a badge;
   an entity commonly holds several. Roles outside the config (ADP OF THE SNF,
   MANAGING CONTROL - GOVERNING BODY) sort last and render no badge. */
const BADGED_ROLES = Object.keys(badgeConfig);

function roleRank(role) {
  const index = BADGED_ROLES.indexOf(role);
  return index === -1 ? BADGED_ROLES.length : index;
}

/* The titleholder takes mail at the nursing home itself — a propco administered from
   the facility, not an arm's-length landlord. Realie ships the mailing address
   unpunctuated, so both sides go through the same normalizer. */
function mailsToFacility(source) {
  const mailing = normalizeEntityName(source?.realie_owner_mailing);
  if (!mailing) return false;

  const facility = normalizeEntityName(
    [
      source?.street_address,
      source?.city,
      source?.state,
      source?.zip_code,
    ].join(' '),
  );

  return facility !== '' && mailing === facility;
}

/* `realie_titleholder_differs` answers a narrower question — whether the titleholder is
   the operator — and answers it with a fuzzy comparison that disagrees with the links in
   both directions, so the network match below stands in for it. */
export function buildRelatedPartyMatches(source) {
  const ownerName = normalizeEntityName(source?.realie_owner_name);
  if (!ownerName) return [];

  const links = source?.facility_ownership_links ?? [];
  const sharesMailing = mailsToFacility(source);

  const matched = new Map();
  for (const link of links) {
    if (link.cms_ownership_role === TITLEHOLDER_ROLE) continue;
    if (normalizeEntityName(link.cms_ownership_name) !== ownerName) continue;

    const slug = link.ownership_entity?.slug;
    if (!slug) continue;

    const entry = matched.get(slug) ?? {
      name:
        link.ownership_entity?.cms_ownership_name ?? link.cms_ownership_name,
      role: link.cms_ownership_role,
    };
    if (roleRank(link.cms_ownership_role) < roleRank(entry.role)) {
      entry.role = link.cms_ownership_role;
    }
    matched.set(slug, entry);
  }

  if (matched.size > 0) {
    const matchedOn = sharesMailing
      ? ['entity_name', 'mailing_address']
      : ['entity_name'];

    return [...matched].map(([slug, { name, role }]) => ({
      id: slug,
      entity_name: toTitleCase(name ?? ''),
      entity_slug: slug,
      matched_on: matchedOn,
      cms_ownership_role: role,
    }));
  }

  if (!sharesMailing) return [];

  /* No CMS entity carries the titleholder's name, so the shared address is the only
     evidence and the titleholder itself is the party to link to. */
  const titleholder = links.find(
    (link) => link.cms_ownership_role === TITLEHOLDER_ROLE,
  );
  const slug = titleholder?.ownership_entity?.slug;
  if (!slug) return [];

  return [
    {
      id: slug,
      entity_name: toTitleCase(
        titleholder.ownership_entity?.cms_ownership_name ??
          source.realie_owner_name,
      ),
      entity_slug: slug,
      matched_on: ['mailing_address'],
      cms_ownership_role: titleholder.cms_ownership_role,
    },
  ];
}

/* Always empty today: a facility carries one parcel — a single set of realie_* columns
   and at most one titleholder link — so there is never a second property to switch to.
   `realie_owner_parcel_count` counts the owner's parcels but ships no address or
   description for them, which is what the banner's rows render. Unblocking this is a
   backend change: realie_facility_link already holds one row per parcel and neither
   facilities route includes it. */
export function buildAssociatedProperties() {
  return [];
}

export function buildPropertyDetailSections(source) {
  return propertyDetailSectionsConfig.map(({ title, left, right }) => ({
    title,
    left: buildFields(left, source),
    right: buildFields(right, source),
  }));
}
