import { formatUSD } from './stringFormatters';
import { buildFootprint } from './footprintMetrics';
import { hasPropertyData, isRelatedParty } from './propertyMetrics';

/**
 * State-context real estate metrics: the Real Estate tab on the state profile.
 *
 * Kept separate from ownerPropertyMetrics.js and propertyMetrics.js — each
 * describes a different subject (an owner's portfolio, one facility's parcel,
 * a state's aggregate real estate). Sharing a module would only blur shapes that
 * happen to look alike today. The two rules the contexts must agree on, "did
 * this facility match a parcel" and "is this a related party", are imported
 * rather than restated.
 *
 * There is no state real estate endpoint. Every figure here is aggregated from
 * the facility rows the profile page already fetches for its deficiencies table,
 * so the tab costs no extra request.
 *
 * Known overstatement, not a bug: a hospital-based SNF matches the whole hospital
 * campus parcel, so its value is the hospital's, not the nursing unit's. In
 * California that is 15% of valued parcels carrying 31.5% of the state total,
 * and it puts single-facility hospital systems at the top of the holdings table
 * ($487M against a $4.5M median). It is left in — the parcel really is what the
 * facility sits on, the same over-attribution applies to any multi-tenant parcel,
 * and realie_use_desc is county-specific free text, so a "HOSPITAL" filter would
 * work in California and quietly do nothing in most other states.
 */

const MARKET = 'market';
const ASSESSED = 'assessed';

function toFiniteNumber(value) {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : null;
}

/* Realie writes 0 rather than null for a value the county does not publish, so
   0 means "not reported" and must not enter a sum as zero dollars. */
function reportedValue(value) {
  const parsed = toFiniteNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

/* Counties publish market value or assessed value, and they do it uniformly by
   state: California reports market on 0 of 937 matched parcels while assessing
   841; Texas reports both, and where both exist they are the same number (median
   ratio 1.000). So the basis is chosen once for the whole state — whichever
   values more parcels, market breaking ties — rather than per parcel. A row-level
   fallback would add two different bases into one total.

   Assessed is safe to sum here in a way it is not on an owner's portfolio: the
   assessment ratio is a statutory state constant, so it is uniform within a
   state and varies 14x across them. Same field, opposite verdict, by context. */
export function resolveValueBasis(facilities) {
  let market = 0;
  let assessed = 0;

  for (const facility of facilities) {
    if (reportedValue(facility?.realie_market_value) !== null) market += 1;
    if (reportedValue(facility?.realie_assessed_value) !== null) assessed += 1;
  }

  return assessed > market ? ASSESSED : MARKET;
}

const VALUE_COLUMN = {
  [MARKET]: 'realie_market_value',
  [ASSESSED]: 'realie_assessed_value',
};

export const VALUE_BASIS_LABEL = {
  [MARKET]: 'market value',
  [ASSESSED]: 'assessed value',
};

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

/* The operator the rest of the site shows for a facility. Only the flagged link
   carries the slug the holdings table links through; a facility either has that
   link or has no owner attribution at all (758 vs 179 in California, with no
   partial cases), so there is nothing to recover from display_owner_name. */
function displayOwner(facility) {
  const link = (facility?.facility_ownership_links ?? []).find(
    (candidate) => candidate?.is_display_owner,
  );
  const entity = link?.ownership_entity;
  if (!entity?.slug) return null;

  const name = entity.cms_ownership_name ?? link.cms_ownership_name;
  return name ? { slug: entity.slug, name } : null;
}

/* One row per facility in the state that matched a Realie parcel, valued on the
   state's basis. Addresses and coordinates come from the facility's own columns,
   which are fully populated, not from realie_address. */
export function buildStateProperties(facilities) {
  const list = Array.isArray(facilities) ? facilities : [];
  const matched = list.filter((facility) => hasPropertyData(facility));
  const basis = resolveValueBasis(matched);
  const column = VALUE_COLUMN[basis];

  const properties = matched.map((facility) => {
    const value = reportedValue(facility[column]);
    const owner = displayOwner(facility);
    return {
      id: String(facility.id),
      facility_name: facility.provider_name,
      facility_slug: facility.slug,
      city: facility.city,
      state: facility.state,
      latitude: toFiniteNumber(facility.latitude),
      longitude: toFiniteNumber(facility.longitude),
      titleholder_name: titleholderName(facility),
      owner_name: owner?.name ?? null,
      owner_slug: owner?.slug ?? null,
      related_party: isRelatedParty(facility),
      value,
      value_display: value === null ? 'Not reported' : formatUSD(value),
    };
  });

  return { properties, basis };
}

/* State figures over the rows above, so every card counts the same properties
   the map and the table show. Returns null when the state has no matched
   parcels — the tab shows an empty state rather than a row of zeros. */
export function buildStateRealEstateSummary(properties, basis) {
  if (!properties?.length) return null;

  const valued = properties.filter((property) => property.value !== null);
  const relatedParty = properties.filter((property) => property.related_party);
  const totalValue = valued.reduce((sum, property) => sum + property.value, 0);

  return {
    value_basis: basis,
    total_properties: properties.length,
    valued_properties: valued.length,
    total_real_estate_value: totalValue,
    average_property_value: valued.length ? totalValue / valued.length : 0,
    related_party_count: relatedParty.length,
    related_party_percentage: Math.round(
      (relatedParty.length / properties.length) * 100,
    ),
    operators_involved: new Set(
      properties.map((property) => property.owner_slug).filter(Boolean),
    ).size,
    property_owners: new Set(
      properties
        .map((property) => property.titleholder_name?.trim().toUpperCase())
        .filter(Boolean),
    ).size,
  };
}

/* Display-ready cards for the Real Estate Highlights row, split by importance:
   two `primary` headline figures (total value, average) over three `supporting`
   counts. Formatting (USD, "%", "n of m") lives here; `icon` is a string token
   the grid maps to a component so this module stays free of JSX.

   Related party is last rather than first, matching the owner tab: the shipped
   flag reads about 3% of parcels in the largest states, so leading with it gives
   the loudest position to the emptiest figure. */
export function buildRealEstateHighlights(summary) {
  const {
    value_basis,
    total_properties,
    valued_properties,
    total_real_estate_value,
    average_property_value,
    related_party_count,
    related_party_percentage,
    operators_involved,
    property_owners,
  } = summary;

  const basisLabel = VALUE_BASIS_LABEL[value_basis] ?? 'value';

  /* The amber treatment is a warning, so it only appears when there is something
     to warn about. */
  const flagged = related_party_count > 0;

  const primary = [
    {
      id: 'total-real-estate-value',
      label: 'Total Real Estate Value',
      value: formatUSD(total_real_estate_value),
      caption: `Total ${basisLabel} of ${valued_properties} of ${total_properties} properties`,
    },
    {
      id: 'average-property-value',
      label: 'Average Real Estate Value',
      value: formatUSD(average_property_value),
      caption: `Average ${basisLabel} of the ${valued_properties} valued`,
    },
  ];

  const supporting = [
    {
      id: 'operators-involved',
      label: 'Operators Involved',
      value: operators_involved,
      caption: 'Distinct operating entities',
    },
    {
      id: 'property-owners',
      label: 'Real Estate Owners',
      value: property_owners,
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

/* Map-ready footprint for the state's facilities. Shares its lat/lng shaping
   with the owner context via footprintMetrics.js. */
export function buildStateFootprint(properties) {
  return buildFootprint(properties);
}

const HOLDINGS_LIMIT = 10;

/* Display-ready rows for the operators holding the most real estate in the
   state, ranked by total value.

   Not ranked by related-party count, which is what the section originally
   specced: the shipped flag is too sparse to concentrate. California's 26
   related-party parcels spread across 22 operators, the largest holding 3, so a
   related-party ranking is a list of ones. Value ranks cleanly, and the
   related-party column still surfaces the flag wherever it fires.

   Facilities with no display-owner link are left out — they have no owner to
   attribute value to — so these counts are a subset of the highlight totals. */
export function buildLargestHoldings(properties) {
  const byOwner = new Map();

  for (const property of properties ?? []) {
    if (!property.owner_slug) continue;

    const existing = byOwner.get(property.owner_slug) ?? {
      id: property.owner_slug,
      owner_name: property.owner_name,
      owner_slug: property.owner_slug,
      facility_count: 0,
      related_party_count: 0,
      re_value: 0,
    };

    existing.facility_count += 1;
    if (property.related_party) existing.related_party_count += 1;
    if (property.value !== null) existing.re_value += property.value;
    byOwner.set(property.owner_slug, existing);
  }

  return [...byOwner.values()]
    .sort((a, b) => b.re_value - a.re_value)
    .slice(0, HOLDINGS_LIMIT)
    .map((holding) => ({
      ...holding,
      related_party_total: holding.facility_count,
      facility_label: `${holding.facility_count} ${
        holding.facility_count === 1 ? 'facility' : 'facilities'
      }`,
      re_value_display: formatUSD(holding.re_value),
    }));
}
