import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseOwners } from '../components/ui/molecule/listContainerContent';
import BrowsePage from '../components/ui/organism/browsePage';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
/**
 * Main page for browsing owners.
 *
 * This component sets up the owner-specific configuration
 * and passes it to the reusable `BrowsePage` component.
 *
 * Props passed to BrowsePage:
 * - apiEndpoint: Base API URL for facilities
 * - title: Page title
 * - searchPlaceholder: Input placeholder text
 * - type: Entity type for routing (owners)
 * - renderList: Function rendering the list of owners
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

export default function Owners() {
  return (
    <>
      <Breadcrumb />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/owners`}
        title="Owners"
        searchPlaceholder="Owner name..."
        type="owners"
        renderList={(items) => (
          <ListContainer
            items={items}
            LayoutSelector={ListContainerSeparate}
            ListContent={BrowseOwners}
          />
        )}
      />
    </>
  );
}
