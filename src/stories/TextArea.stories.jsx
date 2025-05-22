import { Textarea } from "../components/ui/textarea";

export default {
  title: "UI/TextArea",
  component: Textarea,
};

export const Basic = () => {
  return <Textarea aria-label="Description" name="description" />;
};
