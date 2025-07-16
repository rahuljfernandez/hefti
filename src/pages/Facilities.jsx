import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowsePage from '../components/ui/organism/browsePage';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { useSearchParams } from 'react-router-dom';
import { toTitleCase } from '../lib/toTitleCase';

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
  const [searchParams] = useSearchParams();
  const chain = searchParams.get('chain');
  return (
    <>
      <Breadcrumb />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/facilities`}
        title="Nursing Homes"
        searchPlaceholder="Nursing home name..."
        type="facilities"
        renderList={(items) => (
          <>
            {chain && (
              <div className="mb-4 mt-2 text-center">
                <span className="inline-block rounded bg-blue-50 px-4 py-2 text-base font-semibold text-blue-700 border border-blue-100">
                  Showing facilities for operator: {toTitleCase(chain.replace(/-/g, ' '))}
                </span>
              </div>
            )}
            <ListContainer
              items={items}
              LayoutSelector={ListContainerSeparate}
              ListContent={BrowseNursingHomes}
            />
          </>
        )}
      />
    </>
  );
}

export default Facilities;
