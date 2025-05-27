import { Heading } from './heading';

export default function TabTitle({ tabName }) {
  let displayTitle;

  switch (tabName) {
    case 'Provider Highlights & Ownership':
      displayTitle = 'Provider Highlights';
      break;
    case 'Deficiencies & Penalties':
      displayTitle = 'Deficiencies from Inspection Reports';
      break;
    case 'Clinical Quality Measures':
      displayTitle = 'Clinical Quality Measures';
      break;
    case 'Staffing':
      displayTitle = 'Staffing Quality';
      break;
    case 'Financial Overview':
      displayTitle = 'Financial Snapshot';
      break;
    default:
      displayTitle = tabName;
  }
  return (
    <div className="text-heading-sm my-8">
      <Heading level={3}>{displayTitle}</Heading>
    </div>
  );
}
