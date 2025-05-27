import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';

/*Ask Nick about weight for paragraph tiny. Is it 400 or 500 as is showing up in figma for the badge here? */
export default function ProfileHeader() {
  return (
    <div className="bg-background-secondary">
      <Heading className="text-display-xs" level={1}>
        {' '}
        Aspen Point Health and Rehabilitation{' '}
      </Heading>
      <div className="mt-4 flex flex-row gap-2">
        <Badge color="cyan">FOR PROFIT</Badge>
        <Badge color="orange">INDIVIDUAL</Badge>
      </div>
    </div>
  );
}
