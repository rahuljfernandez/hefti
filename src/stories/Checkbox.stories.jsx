import { Checkbox } from "../components/ui/checkbox";

export default {
  title: "UI/Checkbox",
  component: Checkbox,
};

export const Basic = () => {
  return <Checkbox aria-label="Allow embedding" name="allow_embedding" />;
};
