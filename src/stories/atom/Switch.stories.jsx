import { Switch } from '../../components/ui/atom/switch';

export default {
  title: 'COMPONENTS/Atom/Switch',
  component: Switch,
};

export const Basic = () => {
  return <Switch aria-label="Allow embedding" name="allow_embedding" />;
};
