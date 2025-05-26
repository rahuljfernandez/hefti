import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '../../components/ui/molecule/dropdown';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default {
  title: 'COMPONENTS/Molecule/Dropdown',
  component: Dropdown,
};

export const Basic = () => {
  function deleteUser() {
    if (confirm('Are you sure you want to delete this user?')) {
      // ...
    }
  }

  return (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/users/1">View</DropdownItem>
        <DropdownItem href="/users/1/edit">Edit</DropdownItem>
        <DropdownItem onClick={() => deleteUser()}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
