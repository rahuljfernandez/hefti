export function getBadgeColor(rating) {
  switch (rating.toLowerCase()) {
    case 'above average':
      return 'red';
    case 'average':
      return 'yellow';
    case 'below average':
      return 'green';
    default:
      return 'gray';
  }
}
