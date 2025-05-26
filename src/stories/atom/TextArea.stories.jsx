import { Textarea } from '../../components/ui/atom/textarea';

export default {
  title: 'COMPONENTS/Atom/TextArea',
  component: Textarea,
};

export const Basic = () => {
  return <Textarea aria-label="Description" name="description" />;
};
