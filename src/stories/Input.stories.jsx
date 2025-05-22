import { Input } from "../components/ui/input";

export default {
  title: "UI/Input",
  component: Input,
};

export const Basic = () => {
  return <Input aria-label="Full name" name="full_name" />;
};
