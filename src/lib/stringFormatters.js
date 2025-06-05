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
