import { Input } from '../../components/ui/atom/input';

export default {
  title: 'COMPONENTS/Atom/Input',
  component: Input,
};

export const Basic = () => {
  return <Input aria-label="Full name" name="full_name" />;
};
