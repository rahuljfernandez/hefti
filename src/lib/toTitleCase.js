const PRESERVE = ['LLC', 'INC', 'LP', 'LTD', 'CO'];

export function toTitleCase(str = '') {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase();
      return PRESERVE.includes(upper)
        ? upper
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
