import {
  formatMetricValue,
  expandStateAbbreviation,
  formatUSD,
} from './stringFormatters';
import { buildNationalComparison } from './getBadgeColor';
import { toTitleCase } from './toTitleCase';

/**
 * Deficiencies & Penalties metric config and builder helpers.
 *
 * Purpose:
 * - Defines the field-to-card mapping for the Deficiencies & Penalties tab
 * - Transforms raw API fields into the display-ready objects expected by StatsCard
 *
 * Pattern:
 * - Facility builders surface state and national averages as detail1/detail2
 * - Owner builders surface median and std dev as detail1/detail2 (placeholders until backend provides real data)
 */

const facilityDeficienciesConfig = [
  {
    key: 'Total Deficiencies',
    description: 'Total deficiencies found in the past year',
    valueKey: 'health_deficiencies',
    ratingKey: 'cmpr_health_deficiencies',
    stateAvgKey: 'state_health_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
  },
];

const facilityPenaltiesConfig = [
  {
    key: 'Total Penalties',
    description: 'Total number of penalties issued against this facility',
    valueKey: 'total_penalties',
    ratingKey: 'cmpr_total_penalties',
    stateAvgKey: 'state_total_penalties',
    nationalAvgKey: 'national_total_penalties',
    isCurrency: false,
  },
  {
    key: 'Number of Fines',
    description: 'Total fines issued against this facility',
    valueKey: 'number_of_fines',
    ratingKey: 'cmpr_number_of_fines',
    stateAvgKey: 'state_number_of_fines',
    nationalAvgKey: 'national_number_of_fines',
    isCurrency: false,
  },
  {
    key: 'Total Fine Amount',
    description:
      'Total dollar amount of all fines issued against this facility',
    valueKey: 'total_amount_of_fines_in_usd',
    ratingKey: 'cmpr_total_amount_of_fines_in_usd',
    stateAvgKey: 'state_total_amount_of_fines_in_usd',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

// NOTE: owner median/std-dev values are placeholders until backend provides
// owner-level deficiency and penalty distribution data.
const ownerDeficienciesConfig = [
  {
    key: 'Average Total Deficiencies',
    description:
      'Average number of deficiencies found in affiliated homes in the last three years',
    valueKey: 'cms_owner_average_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

const ownerPenaltiesConfig = [
  {
    key: 'Average Number of Penalties',
    description: 'Average number of penalties issued against affiliated homes',
    valueKey: 'cms_owner_average_penalties',
    nationalAvgKey: 'national_total_penalties',
    isCurrency: false,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
  {
    key: 'Average Fine Amount',
    description: 'Average total fines issued against affiliated homes',
    valueKey: 'cms_owner_average_fines',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
    medianKey: 'N/A',
    stdDevKey: 'N/A',
  },
];

export function buildFacilityDeficienciesStats(
  metricsSource,
  nationalBenchmarks,
) {
  const stateName = expandStateAbbreviation(metricsSource?.state);
  return facilityDeficienciesConfig.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = format(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = format(nationalBenchmarks?.[metric.nationalAvgKey]);
    return {
      key: metric.key,
      description: metric.description,
      stat: metricsSource?.[metric.valueKey] ?? 'N/A',
      rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
      isCurrency: metric.isCurrency,
      detail1: stateAvg !== 'N/A' ? `${stateName} average: ${stateAvg}` : null,
      detail2:
        nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

export function buildFacilityPenaltiesStats(metricsSource, nationalBenchmarks) {
  const stateName = expandStateAbbreviation(metricsSource?.state);
  return facilityPenaltiesConfig.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const stateAvg = format(metricsSource?.[metric.stateAvgKey]);
    const nationalAvg = format(nationalBenchmarks?.[metric.nationalAvgKey]);
    return {
      key: metric.key,
      description: metric.description,
      stat: metricsSource?.[metric.valueKey] ?? 'N/A',
      rating: metricsSource?.[metric.ratingKey] ?? 'N/A',
      isCurrency: metric.isCurrency,
      detail1: stateAvg !== 'N/A' ? `${stateName} average: ${stateAvg}` : null,
      detail2:
        nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

/* Owner builders benchmark the owner's average against the national average the
   way the state ones do. Every deficiency/penalty metric is lower-is-better, so
   a value below the national average reads green. */
function buildOwnerStats(config, metricsSource, nationalBenchmarks) {
  const format = (metric, value) =>
    metric.isCurrency ? formatUSD(value) : formatMetricValue(value);

  return config.map((metric) => {
    const rawValue = metricsSource?.[metric.valueKey];
    const { comparison, comparisonColor } = buildNationalComparison(
      rawValue,
      nationalBenchmarks?.[metric.nationalAvgKey],
      false,
    );

    return {
      key: metric.key,
      description: metric.description,
      stat: format(metric, rawValue),
      isCurrency: metric.isCurrency,
      rating: comparison,
      ratingColor: comparisonColor,
      detail1: `Median: ${metric.medianKey}`,
      detail2: `Std Dev: ${metric.stdDevKey}`,
    };
  });
}

export function buildOwnerDeficienciesStats(metricsSource, nationalBenchmarks) {
  return buildOwnerStats(
    ownerDeficienciesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

export function buildOwnerPenaltiesStats(metricsSource, nationalBenchmarks) {
  return buildOwnerStats(
    ownerPenaltiesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

/* State configs mirror the facility benchmark keys but use aggregate wording:
   a state value is the average across the state's nursing homes, not a single
   provider's counts. */
const stateDeficienciesConfig = [
  {
    key: 'Average Deficiencies',
    description:
      'Average deficiencies found across nursing homes in this state over the past year',
    valueKey: 'health_deficiencies',
    nationalAvgKey: 'national_health_deficiencies',
    isCurrency: false,
  },
];

const statePenaltiesConfig = [
  {
    key: 'Average Penalties',
    description:
      'Average number of penalties issued across nursing homes in this state',
    valueKey: 'total_penalties',
    nationalAvgKey: 'national_total_penalties',
    isCurrency: false,
  },
  {
    key: 'Average Number of Fines',
    description:
      'Average number of fines issued across nursing homes in this state',
    valueKey: 'number_of_fines',
    nationalAvgKey: 'national_number_of_fines',
    isCurrency: false,
  },
  {
    key: 'Average Fine Amount',
    description:
      'Average dollar amount of fines issued across nursing homes in this state',
    valueKey: 'total_amount_of_fines_in_usd',
    nationalAvgKey: 'national_total_amount_of_fines_in_usd',
    isCurrency: true,
  },
];

/* State builders benchmark each value against the national average from
   /national, deriving the Above/Below National Average badge like the other
   tabs. Every deficiency/penalty metric is lower-is-better (fewer
   deficiencies, penalties, fines, and dollars are better), so a value below
   the national average reads green. */
function buildStateStats(config, metricsSource, nationalBenchmarks) {
  return config.map((metric) => {
    const format = metric.isCurrency ? formatUSD : formatMetricValue;
    const rawValue = metricsSource?.[metric.valueKey];
    const rawNational = nationalBenchmarks?.[metric.nationalAvgKey];
    const nationalAvg = format(rawNational);
    const { comparison, comparisonColor } = buildNationalComparison(
      rawValue,
      rawNational,
      false,
    );
    return {
      key: metric.key,
      description: metric.description,
      stat: rawValue ?? 'N/A',
      isCurrency: metric.isCurrency,
      rating: comparison,
      ratingColor: comparisonColor,
      detail1:
        nationalAvg !== 'N/A' ? `National average: ${nationalAvg}` : null,
    };
  });
}

export function buildStateDeficienciesStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(
    stateDeficienciesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

export function buildStatePenaltiesStats(metricsSource, nationalBenchmarks) {
  return buildStateStats(
    statePenaltiesConfig,
    metricsSource,
    nationalBenchmarks,
  );
}

/* Compares one deficiency figure to the national average, returning the shared
   red/gray flag and caption both burden tables use. `vs_national_label` is null
   when the benchmark hasn't loaded, so the cell omits the caption rather than
   guessing a direction. */
function deficiencyVsNational(value, nationalAvg, hasNational) {
  if (!hasNational) return { above_national: false, vs_national_label: null };
  if (value > nationalAvg) {
    return {
      above_national: true,
      vs_national_label: `${(value / nationalAvg).toFixed(1)}x national`,
    };
  }
  return {
    above_national: false,
    vs_national_label:
      value === nationalAvg ? 'at national average' : 'below national',
  };
}

/* Shared scaffold for the deficiency-burden tables. Filters the input, maps each
   item to a display row via `toRow` (which returns a numeric `deficiencies` plus
   a `metric_display` string), ranks by deficiency descending, and attaches the
   red/gray bar fraction (scaled to the worst in the set) and the vs-national
   flag/caption. A row whose figure is unknown ('N/A') gets no caption — a
   direction would just be guessing off the coalesced 0 used for sorting. */
function rankByDeficiencyBurden(items, toRow, nationalBenchmarks) {
  const nationalAvg = Number(nationalBenchmarks?.national_health_deficiencies);
  const hasNational = Number.isFinite(nationalAvg) && nationalAvg > 0;

  const ranked = (Array.isArray(items) ? items : [])
    .filter(Boolean)
    .map(toRow)
    .sort((a, b) => b.deficiencies - a.deficiencies);

  const maxDeficiencies = ranked.reduce(
    (max, row) => Math.max(max, row.deficiencies),
    0,
  );

  return ranked.map((row) => {
    const vsNational = deficiencyVsNational(
      row.deficiencies,
      nationalAvg,
      hasNational,
    );
    return {
      ...row,
      ...vsNational,
      vs_national_label:
        row.metric_display === 'N/A' ? null : vsNational.vs_national_label,
      bar_fraction:
        maxDeficiencies > 0 ? row.deficiencies / maxDeficiencies : 0,
    };
  });
}

/* One facility row for the "Deficiencies by Facility" table. A missing count
   shows 'N/A' rather than a fabricated 0; the numeric `deficiencies` keeps 0
   only to sort and scale the bar. Owner display mirrors the facilities browse
   card (primary ownership link). */
function facilityBurdenRow(facility) {
  const deficiencies = facility.health_deficiencies;
  const penalties = facility.total_penalties;
  return {
    id: facility.slug ?? facility.provider_name,
    facility_name: toTitleCase(facility.provider_name || 'Unknown Facility'),
    facility_slug: facility.slug,
    state: facility.state ?? '',
    owner_name: toTitleCase(facility.primary_owner?.name || ''),
    deficiencies: deficiencies ?? 0,
    metric_display: deficiencies == null ? 'N/A' : String(deficiencies),
    penalties_display: penalties == null ? 'N/A' : String(penalties),
    fine_display: formatUSD(facility.total_amount_of_fines_in_usd),
  };
}

/* Display-ready rows for the "Deficiencies by Facility" table (owner and state
   profiles). `facilities` is the full CMS facility records; `nationalBenchmarks`
   is the /national row. */
export function buildDeficiencyBurdenFacilities(
  facilities,
  nationalBenchmarks,
) {
  return rankByDeficiencyBurden(
    facilities,
    facilityBurdenRow,
    nationalBenchmarks,
  );
}

/* One row for the state-profile "Deficiencies by Chain / Individual Owner"
   tables. `stateName` labels the in-state facility count (e.g. "5 Virginia
   facilities"); the averages arrive pre-computed and state-scoped from the
   /state-*-burden endpoint. */
function entityBurdenRow(stateName) {
  return (entity) => ({
    id: entity.slug ?? entity.name,
    entity_name: toTitleCase(entity.name || 'Unknown'),
    entity_raw_name: entity.name ?? '',
    entity_slug: entity.slug,
    facilities_label: `${entity.facilities ?? 0} ${stateName} ${
      entity.facilities === 1 ? 'facility' : 'facilities'
    }`,
    deficiencies: Number(entity.avg_deficiencies) || 0,
    metric_display: formatMetricValue(entity.avg_deficiencies),
    penalties_display: formatMetricValue(entity.avg_penalties),
    fine_display: formatUSD(entity.avg_fines),
  });
}

/* Display-ready rows for the state-profile deficiency-burden tables (chains and
   individual owners share this shape). `entities` comes pre-ranked from the
   /state-chain-burden or /state-individual-burden endpoint. */
export function buildEntityDeficiencyBurden(
  entities,
  nationalBenchmarks,
  stateAbbr,
) {
  return rankByDeficiencyBurden(
    entities,
    entityBurdenRow(expandStateAbbreviation(stateAbbr)),
    nationalBenchmarks,
  );
}
