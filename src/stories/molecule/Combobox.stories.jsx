import {
  Combobox,
  ComboboxLabel,
  ComboboxOption,
} from '../../components/ui/molecule/combobox';

export default {
  title: 'COMPONENTS/Molecule/combobox',
  component: Combobox,
};

const users = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 3,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
  },
];

const currentUser = users[0];

export const Basic = () => {
  return (
    <Combobox
      name="user"
      options={users}
      displayValue={(user) => user?.name}
      defaultValue={currentUser}
      aria-label="Assigned to"
    >
      {(user) => (
        <ComboboxOption value={user}>
          <ComboboxLabel>{user.name}</ComboboxLabel>
        </ComboboxOption>
      )}
    </Combobox>
  );
};
