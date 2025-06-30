import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BrowsePage from '../../components/ui/organism/browsePage';
import ListContainer, {
  ListContainerSeparate,
} from '../../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../../components/ui/molecule/listContainerContent';
import { ownersMock } from '../../lib/mockData';
import HeftiNavbar from '../../components/ui/molecule/heftiNavbar';
import Footer from '../../components/ui/molecule/footer';

export default {
  title: 'COMPONENTS/Page/BrowseFacilities',
  component: BrowsePage,
};

export const Default = () => (
  <MemoryRouter>
    <HeftiNavbar />
    <BrowsePage
      apiEndpoint="/api/facilities"
      title="Nursing Homes"
      searchPlaceholder="Search nursing homes..."
      type="facilities"
      // Mock renderList to just show static data
      renderList={(items) => (
        <ListContainer
          items={ownersMock}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseNursingHomes}
        />
      )}
    />
    <Footer />
  </MemoryRouter>
);
