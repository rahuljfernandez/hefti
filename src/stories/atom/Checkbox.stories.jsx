import { Checkbox } from '../../components/ui/atom/checkbox';

export default {
  title: 'COMPONENTS/Atom/Checkbox',
  component: Checkbox,
};

export const Basic = () => {
  return <Checkbox aria-label="Allow embedding" name="allow_embedding" />;
};
