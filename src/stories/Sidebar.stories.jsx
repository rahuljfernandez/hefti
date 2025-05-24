import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarSection,
} from '../components/ui/sidebar';

export default {
  title: 'COMPONENTS/Sidebar',
  component: Sidebar,
};

export const Basic = () => {
  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/">Home</SidebarItem>
          <SidebarItem href="/events">Events</SidebarItem>
          <SidebarItem href="/orders">Orders</SidebarItem>
          <SidebarItem href="/broadcasts">Broadcasts</SidebarItem>
          <SidebarItem href="/settings">Settings</SidebarItem>
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  );
};
