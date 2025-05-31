import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
/*Creates the header and badges w/ description atop profiles for Facilty or Owner*/

export default function ProfileHeader({ title, badges = [] }) {
  return (
    <div className="bg-background-secondary my-6">
      <Heading className="text-display-xs" level={1}>
        {title}
      </Heading>
      <div className="mt-4 flex flex-row gap-2">
        {badges.map((badge, i) => (
          <Badge key={badge.title + i} color={badge.color}>
            {badge.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}
