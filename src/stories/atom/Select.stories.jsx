import { Select } from '../../components/ui/atom/select';

export default {
  title: 'COMPONENTS/Atom/Select',
  component: Select,
};

export const Basic = () => {
  return (
    <Select aria-label="Project status" name="status">
      <option value="active">Active</option>
      <option value="paused">Paused</option>
      <option value="delayed">Delayed</option>
      <option value="canceled">Canceled</option>
    </Select>
  );
};
