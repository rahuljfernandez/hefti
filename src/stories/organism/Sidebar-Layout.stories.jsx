import { SidebarLayout } from '../../components/ui/organism/sidebar-layout';
import { NavbarItem } from '../../components/ui/molecule/navbar';

export default {
  title: 'COMPONENTS/Organism/SidebarLayout',
  component: SidebarLayout,
};

const Navbar = () => (
  <div className="text-xl font-bold text-zinc-950 dark:text-white">
    My Dashboard
  </div>
);

const Sidebar = () => (
  <nav className="flex h-full flex-col gap-2 bg-zinc-100 p-4 dark:bg-zinc-900">
    <NavbarItem href="#">Home</NavbarItem>
    <NavbarItem href="#">Analytics</NavbarItem>
    <NavbarItem href="#">Settings</NavbarItem>
  </nav>
);

export const Default = () => (
  <SidebarLayout navbar={<Navbar />} sidebar={<Sidebar />}>
    <p className="text-zinc-800 dark:text-zinc-200">
      Welcome to the dashboard.
    </p>
  </SidebarLayout>
);
