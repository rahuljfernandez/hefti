import { Badge, BadgeButton } from "../components/ui/badge";

export default {
  title: "UI/Badge",
  component: Badge,
};

export const BadgeColors = () => {
  return (
    <div className="flex gap-3">
      <Badge color="lime">documentation</Badge>
      <Badge color="purple">help wanted</Badge>
      <Badge color="rose">bug</Badge>
    </div>
  );
};

export const BadgeButtons = () => {
  return <BadgeButton>documentation</BadgeButton>;
};

export const BadgeLinks = () => {
  return <BadgeButton href="#">documentation</BadgeButton>;
};
