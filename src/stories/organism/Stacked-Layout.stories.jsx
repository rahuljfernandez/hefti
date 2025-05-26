import { StackedLayout } from './StackedLayout';
import { NavbarItem } from '../navbar';

export default {
  title: 'COMPONENTS/Organism/StackedLayout',
  component: StackedLayout,
};

const Navbar = () => (
  <div className="text-xl font-bold text-zinc-950 dark:text-white">My App</div>
);

const Sidebar = () => (
  <nav className="flex h-full flex-col gap-2 bg-zinc-100 p-4 dark:bg-zinc-900">
    <NavbarItem href="#">Overview</NavbarItem>
    <NavbarItem href="#">Docs</NavbarItem>
    <NavbarItem href="#">Support</NavbarItem>
  </nav>
);

export const Default = () => (
  <StackedLayout navbar={<Navbar />} sidebar={<Sidebar />}>
    <p className="text-zinc-800 dark:text-zinc-200">
      This is the main content of the page.
    </p>
  </StackedLayout>
);
