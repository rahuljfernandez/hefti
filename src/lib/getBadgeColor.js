//Helper function to choose badge color/will need to be modified to relect cases where below average is bad or good
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
