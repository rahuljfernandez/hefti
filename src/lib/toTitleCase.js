export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
