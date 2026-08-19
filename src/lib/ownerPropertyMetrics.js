import { formatUSD } from './stringFormatters';
import { buildFootprint } from './footprintMetrics';
import { hasPropertyData, isRelatedParty } from './propertyMetrics';

/**
 * Owner-context property metrics: the Property Details tab on the owner profile.
 *
 * Deliberately separate from propertyMetrics.js. That file describes ONE
 * property (the facility context); an owner holds many, so this context is
 * list-shaped — a portfolio summary plus a list of property rows — and sharing
 * a module would only blur two different shapes together. The two rules the
 * contexts must agree on, "did this facility match a parcel" and "is this a
 * related party", are imported rather than restated.
 *
 * The owner endpoint carries no usable portfolio aggregates: the
 * `realie_owner_*` columns on the owner record are populated only on Realie's
 * synthetic titleholder entities and are null on every CMS owner, which is what
 * a profile page shows. So the summary is derived from the linked facilities.
 */

function toFiniteNumber(value) {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : null;
}

/* Counties that publish only an assessment leave realie_market_value at 0 rather
   than null — 20% of matched parcels, clustered in CA/MA/RI/CT, and 93% of them
   carry a positive assessed value. Summing those zeros would read as portfolio
   value the owner does not have, so 0 is treated as "not reported". */
function marketValue(facility) {
  const value = toFiniteNumber(facility?.realie_market_value);
  return value !== null && value > 0 ? value : null;
}

/* Realie writes this literal into realie_owner_name instead of leaving it empty,
   so it would otherwise count as a landlord entity of its own. */
const MISSING_OWNER_NAME = 'NOT AVAILABLE FROM THE DATA';

function titleholderName(facility) {
  const name = facility?.realie_owner_name;
  if (typeof name !== 'string') return null;

  const trimmed = name.trim();
  return trimmed === '' || trimmed.toUpperCase() === MISSING_OWNER_NAME
    ? null
    : trimmed;
}

/* One row per facility the owner is linked to that matched a Realie parcel.
   Links repeat a facility once per ownership role, so they are deduped by
   facility id before anything counts them.
   Addresses come from the facility's own columns, not realie_address: they are
   fully populated and are the address the rest of the profile already shows. */
export function buildOwnerProperties(owner) {
  const seen = new Map();

  for (const link of owner?.facility_ownership_links ?? []) {
    const facility = link?.facility;
    if (!facility || seen.has(facility.id)) continue;
    if (!hasPropertyData(facility)) continue;
    seen.set(facility.id, facility);
  }

  return [...seen.values()].map((facility) => {
    const market = marketValue(facility);
    return {
      id: String(facility.id),
      facility_name: facility.provider_name,
      facility_slug: facility.slug,
      street_address: facility.street_address,
      city: facility.city,
      state: facility.state,
      zip_code: facility.zip_code,
      latitude: toFiniteNumber(facility.latitude),
      longitude: toFiniteNumber(facility.longitude),
      titleholder_name: titleholderName(facility),
      related_party: isRelatedParty(facility),
      market_value: market,
      market_value_display:
        market === null ? 'Not reported' : formatUSD(market),
    };
  });
}

/* Portfolio figures over the rows above, so every card counts the same
   properties the list and the map show. Returns null when the owner has no
   matched parcels — the tab shows an empty state rather than a row of zeros. */
export function buildPortfolioSummary(properties) {
  if (!properties?.length) return null;

  const valued = properties.filter((p) => p.market_value !== null);
  const relatedParty = properties.filter((p) => p.related_party);

  return {
    total_properties: properties.length,
    related_party_count: relatedParty.length,
    related_party_percentage: Math.round(
      (relatedParty.length / properties.length) * 100,
    ),
    portfolio_value: valued.reduce((sum, p) => sum + p.market_value, 0),
    valued_properties: valued.length,
    states: [...new Set(properties.map((p) => p.state).filter(Boolean))].sort(),
    distinct_owners: new Set(
      properties
        .map((p) => p.titleholder_name?.trim().toUpperCase())
        .filter(Boolean),
    ).size,
  };
}

/* Display-ready cards for the Real Estate Highlights row, split by importance:
   two `primary` headline figures (total value, geographic spread) over three
   `supporting` counts. Formatting (USD, "%", "n of m") lives here; `icon` is a
   string token the organism maps to a component so this module stays free of JSX.

   Related party is last rather than first: the shipped flag reads 0% on most
   owners, so leading with it gives the loudest position to the emptiest figure. */
export function buildPortfolioHighlights(summary) {
  const {
    related_party_percentage,
    related_party_count,
    total_properties,
    portfolio_value,
    valued_properties,
    distinct_owners,
  } = summary;
  const states = summary.states ?? [];

  /* The amber treatment is a warning, so it only appears when there is something
     to warn about — most portfolios flag no related party at all. */
  const flagged = related_party_count > 0;

  const primary = [
    /* Not "Portfolio Value": the CMS owner holds title to ~2% of these parcels,
       so naming them a portfolio would assert an ownership that mostly is not
       there. Matches the state context's "Total Real Estate Value". */
    {
      id: 'real-estate-value',
      label: 'Total Real Estate Value',
      value: formatUSD(portfolio_value),
      caption:
        valued_properties < total_properties
          ? `Total market value of ${valued_properties} of ${total_properties} properties`
          : 'Total market value',
    },
    {
      id: 'states',
      label: 'States',
      value: states.length,
      caption: states.join(', '),
    },
  ];

  const supporting = [
    {
      id: 'properties',
      label: 'Properties',
      value: total_properties,
      caption: 'Real estate parcels',
    },
    {
      id: 'property-owners',
      label: 'Property Owners',
      value: distinct_owners,
      caption: 'Distinct landlord entities',
    },
    {
      id: 'related-party',
      label: 'Related Party',
      value: `${related_party_percentage}%`,
      aside: `${related_party_count} of ${total_properties}`,
      caption: 'Possible related party owned',
      accent: flagged ? 'amber' : undefined,
      icon: flagged ? 'warning' : undefined,
    },
  ];

  return { primary, supporting };
}

/* Map-ready footprint for the owner's properties — one marker per property with
   coordinates, plus the box the map fits on load. The lat/lng shaping is shared
   with the state context in footprintMetrics.js. */
export function buildOwnerFootprint(properties) {
  return buildFootprint(properties);
}

/* Filter options for the Properties list. The option arrays feed the SelectMenu
   controls and `selectOwnerProperties` reads the same values, so the dropdowns
   and the logic stay one source of truth. Sort reuses SelectMenu's built-in
   'asc'/'desc' options — the only sortable figure the cards show is market value,
   which those defaults already cover. */
/* Option labels must not repeat the control's own label — SelectMenu renders that
   label as the "no filter" placeholder, so a "Related Party" option would sit
   directly under an identical "Related Party" default. */
export const OWNER_PROPERTY_RELATED_PARTY_OPTIONS = [
  { label: 'Related party only', value: 'related' },
  { label: 'Not related party', value: 'not-related' },
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

/* An unreported market value sorts as 0 (same rows the value filter would drop),
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
    result = [...result].sort((a, b) => marketValueKey(b) - marketValueKey(a));
  } else if (sort === 'asc') {
    result = [...result].sort((a, b) => marketValueKey(a) - marketValueKey(b));
  }

  return result;
}
