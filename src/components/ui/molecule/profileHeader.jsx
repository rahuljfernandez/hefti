import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';

export default function ProfileHeader({ title, badges = [] }) {
  return (
    <div className="bg-background-secondary">
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
