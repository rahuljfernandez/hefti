import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export default {
  title: 'COMPONENTS/Table',
  component: Table,
};

const users = [
  {
    handle: 'jdoe',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    access: 'Admin',
  },
  {
    handle: 'jsmith',
    name: 'John Smith',
    email: 'john.smith@example.com',
    access: 'Editor',
  },
  {
    handle: 'alee',
    name: 'Alex Lee',
    email: 'alex.lee@example.com',
    access: 'Viewer',
  },
];

export const Basic = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Role</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.handle}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-zinc-500">{user.access}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
