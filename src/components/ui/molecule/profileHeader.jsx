import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
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
