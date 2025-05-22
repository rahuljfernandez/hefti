import { Switch } from "../components/ui/switch";

export default {
  title: "UI/Switch",
  component: Switch,
};

export const Basic = () => {
  return <Switch aria-label="Allow embedding" name="allow_embedding" />;
};
