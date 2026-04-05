const STATE_ABBREVIATIONS = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

export function expandStateAbbreviation(abbr) {
  if (!abbr) return 'N/A';
  return STATE_ABBREVIATIONS[abbr.toUpperCase()] ?? abbr;
}

export function toSentenceCase(str) {
  if (!str || typeof str !== 'string') return '';

  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatOwnershipPercentage(value) {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();

  // Only format if it’s not a number with a %
  const isNumericPercentage = /^\d+%$/.test(trimmed);

  return isNumericPercentage ? trimmed : toSentenceCase(trimmed);
}

export function formatPhoneNumber(phone) {
  if (!phone) return 'N/A';
  const cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

export function formatUSD(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value !== 'number') return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMetricValue(metricValue) {
  if (metricValue === null || metricValue === undefined || metricValue === '') {
    return 'N/A';
  }

  const numericValue = Number(metricValue);
  if (Number.isNaN(numericValue)) {
    return metricValue;
  }

  return numericValue.toFixed(1);
}
