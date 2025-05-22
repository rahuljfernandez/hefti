import { Text } from "../components/ui/text";

export default {
  title: "UI/Text",
  component: Text,
};

export const Basic = () => {
  return (
    <Text>
      Deleting your account is permanent, and your data will not be able to be
      recovered.
    </Text>
  );
};
