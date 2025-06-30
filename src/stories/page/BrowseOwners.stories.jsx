import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BrowsePage from '../../components/ui/organism/browsePage';
import ListContainer, {
  ListContainerSeparate,
} from '../../components/ui/organism/ListContainer';
import { BrowseOwners } from '../../components/ui/molecule/listContainerContent';
import { facilitiesMock } from '../../lib/mockData';
import HeftiNavbar from '../../components/ui/molecule/heftiNavbar';
import Footer from '../../components/ui/molecule/footer';

export default {
  title: 'COMPONENTS/Page/BrowseOwners',
  component: BrowsePage,
};

export const Default = () => (
  <MemoryRouter>
    <HeftiNavbar />
    <BrowsePage
      apiEndpoint="/api/owners"
      title="Owners"
      searchPlaceholder="Search owners..."
      type="owners"
      // Mock renderList to just show static data
      renderList={(items) => (
        <ListContainer
          items={facilitiesMock}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseOwners}
        />
      )}
    />
    <Footer />
  </MemoryRouter>
);
