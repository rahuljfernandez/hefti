import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from '../../components/ui/molecule/listbox';

export default {
  title: 'COMPONENTS/Molecule/Listbox',
  component: Listbox,
};
export const Basic = () => {
  return (
    <Listbox name="status" defaultValue="active" aria-label="Project status">
      <ListboxOption value="active">
        <ListboxLabel>Active</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="paused">
        <ListboxLabel>Paused</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="delayed">
        <ListboxLabel>Delayed</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="canceled">
        <ListboxLabel>Canceled</ListboxLabel>
      </ListboxOption>
    </Listbox>
  );
};
