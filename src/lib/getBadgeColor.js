const getBadgeColorAboveBelow = (rating, higherIsBetter = false) => {
  if (!rating) return 'gray';
  switch (rating.toLowerCase()) {
    case 'above state average':
      return higherIsBetter ? 'green' : 'red';
    case 'average':
      return 'yellow';
    case 'below state average':
      return higherIsBetter ? 'red' : 'green';
    default:
      return 'gray';
  }
};
const getBadgeColorOwnerProfile = (type) => {
  switch (type) {
    case 'Organization':
      return 'orange';
    case 'Individual':
      return 'teal';
  }
};

const getBadgeColorOwnershipType = (type) => {
  switch (type) {
    case 'FOR PROFIT - CORPORATION':
      return 'cyan';
    case 'FOR PROFIT - INDIVIDUAL':
      return 'cyan';
    case 'FOR PROFIT - LIMITED LIABILITY COMPANY':
      return 'cyan';
    case 'FOR PROFIT - PARTNERSHIP':
      return 'cyan';
    case 'GOVERNMENT - CITY':
      return 'green';
    case 'GOVERNMENT - CITY/COUNTY':
      return 'green';
    case 'GOVERNMENT - COUNTY':
      return 'green';
    case 'GOVERNMENT - FEDERAL':
      return 'green';
    case 'GOVERNMENT - HOSPITAL DISTRICT':
      return 'green';
    case 'GOVERNMENT - STATE':
      return 'green';
    case 'NONPROFIT - CHURCH RELATED':
      return 'purple';
    case 'NONPROFIT - CORPORATION':
      return 'purple';
    case 'NONPROFIT - OTHER':
      return 'purple';
    default:
      return 'gray';
  }
};

const badgeConfig = {
  '5% OR GREATER DIRECT OWNERSHIP INTEREST': {
    color: 'blue',
    label: 'DIRECT OWNERSHIP',
  },
  '5% OR GREATER INDIRECT OWNERSHIP INTEREST': {
    color: 'purple',
    label: 'INDIRECT OWNERSHIP',
  },
  '5% OR GREATER MORTGAGE INTEREST': {
    color: 'orange',
    label: 'MORTGAGE INTEREST',
  },
  '5% OR GREATER SECURITY INTEREST': {
    color: 'orange',
    label: 'SECURITY INTEREST',
  },
  'PARTNERSHIP INTEREST': {
    color: 'orange',
    label: 'PARTNERSHIP INTEREST',
  },
  'CORPORATE OFFICER': {
    color: 'red',
    label: 'CORPORATE OFFICER',
  },
  'CORPORATE DIRECTOR': {
    color: 'red',
    label: 'CORPORATE DIRECTOR',
  },
  'MANAGING EMPLOYEE': {
    color: 'red',
    label: 'MANAGING EMPLOYEE',
  },
  'W-2 MANAGING EMPLOYEE': {
    color: 'red',
    label: 'W-2 MANAGING EMPLOYEE',
  },
  'OPERATIONAL/MANAGERIAL CONTROL': {
    color: 'yellow',
    label: 'OPERATIONAL/MANAGERIAL CONTROL',
  },

  'N/A': { color: '', label: 'None' },
  'OWNERSHIP DATA NOT AVAILABLE': { color: '', label: 'None' },
};

// Returns a badge color based on a CMS comparison string (e.g. "Above State Average").
// Pass higherIsBetter=true for metrics where a higher value is desirable (e.g. vaccination rates).
// Default assumes lower is better (e.g. falls, infections, hospitalizations).
const getCmprColor = (cmpr, higherIsBetter = false) => {
  if (!cmpr) return 'gray';
  const lower = cmpr.toLowerCase();
  if (lower.includes('above')) return higherIsBetter ? 'green' : 'red';
  if (lower.includes('below')) return higherIsBetter ? 'red' : 'green';
  return 'yellow';
};

/* Derives a comparison badge for a subject's value against the national
   average when the API provides no precomputed comparison string (e.g. a
   state's metric vs. the /national benchmark). Mirrors the facility badge:
   the label states numeric direction ("Above/Below National Average") while the
   color reflects performance — for a lower-is-better metric, sitting above the
   benchmark is worse, so the badge reads "Above National Average" in red. Returns
   { comparison, comparisonColor }; comparison is null when either value is
   missing so no badge renders. */
const buildNationalComparison = (rawValue, rawBenchmark, higherIsBetter = false) => {
  const value = Number(rawValue);
  const benchmark = Number(rawBenchmark);
  if (!Number.isFinite(value) || !Number.isFinite(benchmark)) {
    return { comparison: null, comparisonColor: 'gray' };
  }
  if (value === benchmark) {
    return { comparison: 'Same As National Average', comparisonColor: 'yellow' };
  }
  const isAbove = value > benchmark;
  const isBetter = higherIsBetter ? isAbove : !isAbove;
  return {
    comparison: isAbove ? 'Above National Average' : 'Below National Average',
    comparisonColor: isBetter ? 'green' : 'red',
  };
};

export {
  getBadgeColorAboveBelow,
  getBadgeColorOwnershipType,
  badgeConfig,
  getBadgeColorOwnerProfile,
  getCmprColor,
  buildNationalComparison,
};
