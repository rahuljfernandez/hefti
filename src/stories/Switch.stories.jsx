import { Switch } from '../components/ui/switch';

export default {
  title: 'COMPONENTS/Switch',
  component: Switch,
};

export const Basic = () => {
  return <Switch aria-label="Allow embedding" name="allow_embedding" />;
};
