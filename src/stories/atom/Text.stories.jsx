import { Text } from '../../components/ui/atom/text';

export default {
  title: 'COMPONENTS/Atom/Text',
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
