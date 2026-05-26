import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowsePage from '../components/ui/organism/browsePage';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { facilityListPages, rankingsFacilityListPages } from '../lib/breadcrumbPages';
import { useSearchParams, useLocation } from 'react-router-dom';
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
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * Sort options for the facilities browse page.
 * Rating fields use a compound "field:direction" value so browsePage can split
 * them into separate `sortBy` and `sort` URL params for the API.
 * Plain "asc"/"desc" values fall back to the default name-based sort.
 */
const FACILITY_SORT_OPTIONS = [
  { label: 'Overall Rating', value: 'overall_rating:desc' },
  { label: 'Staffing Rating', value: 'staffing_rating:desc' },
  { label: 'Health Inspection', value: 'health_inspection_rating:desc' },
  { label: 'Operating Margin', value: 'operating_margin:desc' },
  { label: 'Name (A–Z)', value: 'asc' },
  { label: 'Name (Z–A)', value: 'desc' },
];

function Facilities() {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const chain = searchParams.get('chain');
  const breadcrumb = state?.from === 'rankings' ? rankingsFacilityListPages : facilityListPages;
  return (
    <>
      <Breadcrumb pages={breadcrumb} />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/facilities`}
        title="Nursing Homes"
        searchPlaceholder="Nursing home name..."
        type="facilities"
        sortOptions={FACILITY_SORT_OPTIONS}
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
              ListContent={state?.from === 'rankings' ? (props) => <BrowseNursingHomes {...props} linkState={{ from: 'rankings' }} /> : BrowseNursingHomes}
            />
          </>
        )}
      />
    </>
  );
}

export default Facilities;
