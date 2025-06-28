import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowsePage from '../components/ui/organism/browsePage';

/**
 * Main page for browsing nursing home facilities.
 *
 * This component sets up the facilities-specific configuration
 * and passes it to the reusable `BrowsePage` component.
 *
 * Props passed to BrowsePage:
 * - apiEndpoint: Base API URL for facilities
 * - title: Page title
 * - searchPlaceholder: Input placeholder text
 * - type: Entity type for routing (facilities)
 * - renderList: Function rendering the list of facilities
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

function Facilities() {
  return (
    <BrowsePage
      apiEndpoint={`${API_BASE_URL}/facilities`}
      title="Nursing Homes"
      searchPlaceholder="Nursing home name..."
      type="facilities"
      renderList={(items) => (
        <ListContainer
          items={items}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseNursingHomes}
        />
      )}
    />
  );
}

export default Facilities;
