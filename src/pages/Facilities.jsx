import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import {
  BrowseNursingHomes,
  BrowseNursingHomesRatings,
} from '../components/ui/molecule/listContainerContent';
import BrowsePage from '../components/ui/organism/browsePage';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import {
  facilityListPages,
  rankingsFacilityListPages,
} from '../lib/breadcrumbPages';
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
 * - filterOptions: Sort category options (Name, Overall Rating, etc.)
 * - renderList: Function rendering the list of facilities
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

//We include the filter options here because this is specific to facility context. Facility, owner, and ranking browses share the same internal components, thus these options need to be passed into BrowsePage as contextual props
const FACILITY_FILTER_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Overall Rating', value: 'overall_rating' },
  { label: 'Staffing Rating', value: 'staffing_rating' },
  { label: 'Health Inspection', value: 'health_inspection_rating' },
  { label: 'Financial', value: 'operating_margin' },
];

function Facilities() {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const chain = searchParams.get('chain');
  const sortBy = searchParams.get('sortBy') || '';
  const breadcrumb =
    state?.from === 'rankings' ? rankingsFacilityListPages : facilityListPages;

  // Pass linkState through to whichever card is rendered so the breadcrumb trail is correct.
  const linkState =
    state?.from === 'rankings' ? { from: 'rankings' } : undefined;

  // When a field-based sort is active, show the ratings card with that metric highlighted. Otherwise fall back to the standard ownership card.
  const CardComponent = sortBy
    ? (props) => (
        <BrowseNursingHomesRatings
          {...props}
          activeMetric={sortBy}
          linkState={linkState}
        />
      )
    : (props) => <BrowseNursingHomes {...props} linkState={linkState} />;

  return (
    <>
      <Breadcrumb pages={breadcrumb} />
      <BrowsePage
        apiEndpoint={`${API_BASE_URL}/facilities`}
        title="Nursing Homes"
        searchHeading="Search by name or CCN"
        searchPlaceholder="Nursing home name or CCN..."
        type="facilities"
        filterOptions={FACILITY_FILTER_OPTIONS}
        renderList={(items) => (
          <>
            {chain && (
              <div className="mt-2 mb-4 text-center">
                <span className="inline-block rounded border border-blue-100 bg-blue-50 px-4 py-2 text-base font-semibold text-blue-700">
                  Showing facilities for operator:{' '}
                  {toTitleCase(chain.replace(/-/g, ' '))}
                </span>
              </div>
            )}
            <ListContainer
              items={items}
              LayoutSelector={ListContainerSeparate}
              ListContent={CardComponent}
            />
          </>
        )}
      />
    </>
  );
}

export default Facilities;
