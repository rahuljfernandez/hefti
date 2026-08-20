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

/* Assessed value is a statutory fraction of market that varies 14x across states
   — 6% in South Carolina, 100% in Texas — so assessed and market dollars can
   never be summed together, and a raw assessed total is not comparable to a
   market one. Every state is therefore brought onto a market basis before its
   parcels are added up:

     - 35 states publish market on most parcels; it is used directly.
     - 8 publish both, so the state's own assessed/market ratio is measured from
       the parcels carrying both and applied to the assessed-only ones. This
       keeps the coverage that made assessed attractive without adopting its
       scale — Delaware's assessed total is 13x low, Illinois' 3.5x.
     - The rest publish assessed only, so the ratio is calibrated against sale
       prices instead, drifted 2%/yr to the assessment year. Softer than the
       above: nursing home sale prices often include the operating business, and
       2% is a stand-in for real appreciation.

   California is the exception and no ratio can fix it. Proposition 13 assesses at
   acquisition value rather than a fraction of market, so what its number tracks
   is when each property last changed hands: measured against drifted sale prices
   its parcels come in at 0.961, and parcels last sold before 2005 carry 56% of
   the per-square-foot basis of recently sold ones. It stays on assessed and says
   so. Michigan and Oregon cap assessed growth the same way but publish market,
   so they are unaffected. */
const ACQUISITION_BASIS_STATES = new Set(['CA']);

/* Why a total is stuck in assessed dollars — Proposition 13 for California, too
   thin a sample to calibrate anywhere else. The caption has to name the right
   one; Maine does not have Proposition 13. */
const ACQUISITION = 'acquisition';
const UNCALIBRATED = 'uncalibrated';

/* Below this many paired parcels the median ratio is noise, so the state keeps
   its raw assessed total and is labelled uncalibrated rather than silently
   scaled by a number derived from four sales (Maine) or ten (Vermont). */
const MIN_CALIBRATION_SAMPLE = 12;

const ASSESSMENT_DRIFT = 1.02;

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function yearOf(value) {
  const match = String(value ?? '').match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

/* Assessed as a fraction of the last sale price, carried forward to the year the
   assessment was struck so the two are quoted in the same era's dollars. */
function saleRatios(facilities) {
  const ratios = [];

  for (const facility of facilities) {
    const assessed = reportedValue(facility?.realie_assessed_value);
    const price = reportedValue(facility?.realie_last_transfer_price);
    const soldIn = yearOf(facility?.realie_last_transfer_date);
    const assessedIn = yearOf(facility?.realie_assessed_year);
    if (assessed === null || price === null || soldIn === null || assessedIn === null) continue;
    if (assessedIn < soldIn) continue;

    ratios.push(assessed / (price * ASSESSMENT_DRIFT ** (assessedIn - soldIn)));
  }

  return ratios;
}

function marketRatios(facilities) {
  const ratios = [];

  for (const facility of facilities) {
    const market = reportedValue(facility?.realie_market_value);
    const assessed = reportedValue(facility?.realie_assessed_value);
    if (market !== null && assessed !== null) ratios.push(assessed / market);
  }

  return ratios;
}

/* How this state's parcels become comparable dollars. `ratio` converts an
   assessed figure to a market one; null means no conversion was possible, and
   `comparable` is false exactly when the total is still in assessed dollars. */
export function resolveValuation(facilities) {
  const list = Array.isArray(facilities) ? facilities : [];
  const state = String(
    list.find((facility) => facility?.state)?.state ?? '',
  ).toUpperCase();
  const marketCount = list.filter(
    (facility) => reportedValue(facility?.realie_market_value) !== null,
  ).length;
  const assessedCount = list.filter(
    (facility) => reportedValue(facility?.realie_assessed_value) !== null,
  ).length;

  if (marketCount) {
    /* Paired parcels are the better calibration; sale prices are the weaker
       fallback for states that publish market on too few parcels to pair. */
    const paired = marketRatios(list);
    const ratios = paired.length >= MIN_CALIBRATION_SAMPLE ? paired : saleRatios(list);
    const ratio = ratios.length >= MIN_CALIBRATION_SAMPLE ? median(ratios) : null;

    /* Market is the better basis but not at any coverage: South Dakota publishes
       it on 3 parcels against 29 assessed, so with no ratio to convert the rest
       a market total would report 5% of the state and call it complete. Falling
       back reports all 29 in assessed dollars and says they aren't comparable. */
    if (ratio === null && marketCount < assessedCount) {
      return { basis: ASSESSED, ratio: null, comparable: false, reason: UNCALIBRATED };
    }

    return { basis: MARKET, ratio, comparable: true, reason: null };
  }

  if (ACQUISITION_BASIS_STATES.has(state)) {
    return { basis: ASSESSED, ratio: null, comparable: false, reason: ACQUISITION };
  }

  const ratios = saleRatios(list);
  const ratio = ratios.length >= MIN_CALIBRATION_SAMPLE ? median(ratios) : null;
  return {
    basis: ASSESSED,
    ratio,
    comparable: ratio !== null,
    reason: ratio === null ? UNCALIBRATED : null,
  };
}

/* Market dollars for one parcel, or null when the county published nothing this
   state's basis can use. `estimated` marks the ones that went through a ratio. */
function parcelValue(facility, valuation) {
  const market = reportedValue(facility?.realie_market_value);
  const assessed = reportedValue(facility?.realie_assessed_value);

  if (valuation.basis === MARKET) {
    if (market !== null) return { value: market, estimated: false };
    if (assessed !== null && valuation.ratio) {
      return { value: assessed / valuation.ratio, estimated: true };
    }
    return { value: null, estimated: false };
  }

  if (assessed === null) return { value: null, estimated: false };
  if (valuation.ratio) return { value: assessed / valuation.ratio, estimated: true };
  return { value: assessed, estimated: false };
}

/* "Estimated" describes the figure, not the method: a state whose parcels all
   came through a ratio has an estimated total, while one that converted a
   handful of stragglers is still reporting market value and says how many were
   filled in. */
export function valueBasisLabel(valuation, estimated, valued) {
  if (!valuation.comparable) return 'assessed value';
  return estimated > 0 && estimated === valued
    ? 'estimated market value'
    : 'market value';
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

/* The operator the rest of the site shows for a facility. /state-facilities
   resolves the flagged link server-side; the slug is required because the
   holdings table links through it, and a facility either has that link or has no
   owner attribution at all (758 vs 179 in California, with no partial cases). */
function displayOwner(facility) {
  const owner = facility?.owner;
  return owner?.slug && owner?.name ? owner : null;
}

/* One row per facility in the state that matched a Realie parcel, valued on the
   state's basis. Addresses and coordinates come from the facility's own columns,
   which are fully populated, not from realie_address. */
export function buildStateProperties(facilities) {
  const list = Array.isArray(facilities) ? facilities : [];
  const matched = list.filter((facility) => hasPropertyData(facility));
  const valuation = resolveValuation(matched);

  const properties = matched.map((facility) => {
    const { value, estimated } = parcelValue(facility, valuation);
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
      value_estimated: estimated,
      value_display: value === null ? 'Not reported' : formatUSD(value),
    };
  });

  return { properties, valuation };
}

/* State figures over the rows above, so every card counts the same properties
   the map and the table show. Returns null when the state has no matched
   parcels — the tab shows an empty state rather than a row of zeros. */
export function buildStateRealEstateSummary(properties, valuation) {
  if (!properties?.length) return null;

  const valued = properties.filter((property) => property.value !== null);
  const relatedParty = properties.filter((property) => property.related_party);
  const totalValue = valued.reduce((sum, property) => sum + property.value, 0);

  const estimated = valued.filter((property) => property.value_estimated).length;

  return {
    value_basis: valuation.basis,
    value_label: valueBasisLabel(valuation, estimated, valued.length),
    comparable: valuation.comparable,
    uncomparable_reason: valuation.reason ?? null,
    total_properties: properties.length,
    valued_properties: valued.length,
    estimated_properties: estimated,
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
    value_label,
    comparable,
    uncomparable_reason,
    total_properties,
    valued_properties,
    estimated_properties,
    total_real_estate_value,
    average_property_value,
    related_party_count,
    related_party_percentage,
    operators_involved,
    property_owners,
  } = summary;

  /* An uncomparable total is a number a reader will compare unless told not to,
     so the caption says why rather than leaving "assessed" to carry it. */
  const UNCOMPARABLE_NOTE = {
    acquisition:
      ' · assessed at purchase price under Proposition 13, so it is not comparable to other states',
    uncalibrated:
      ' · too few published market values or recorded sales to estimate one, so it is not comparable to other states',
  };

  const basisNote = comparable ? '' : (UNCOMPARABLE_NOTE[uncomparable_reason] ?? '');

  const estimatedNote =
    comparable && estimated_properties > 0 && estimated_properties < valued_properties
      ? `, ${estimated_properties} estimated from assessed value`
      : '';

  /* The amber treatment is a warning, so it only appears when there is something
     to warn about. */
  const flagged = related_party_count > 0;

  const primary = [
    {
      id: 'total-real-estate-value',
      label: 'Total Real Estate Value',
      value: formatUSD(total_real_estate_value),
      caption: `Total ${value_label} of ${valued_properties} of ${total_properties} properties${estimatedNote}${basisNote}`,
    },
    {
      id: 'average-property-value',
      label: 'Average Real Estate Value',
      value: formatUSD(average_property_value),
      caption: `Average ${value_label} of the ${valued_properties} valued`,
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
