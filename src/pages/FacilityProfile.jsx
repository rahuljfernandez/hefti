import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';

import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { getFacilityProfilePages } from '../lib/breadcrumbPages';

import { getBadgeColorOwnershipType } from '../lib/getBadgeColor';

import { profileTabsDescriptions } from '../lib/tabDescriptions';
import TabsShell from '../components/ui/molecule/tabsShell';
import ProviderHighlights from '../components/ui/organism/providerHighlights';
import DeficienciesTab from '../components/ui/molecule/tabs/deficienciesTab';
import ClinicalQualityTab from '../components/ui/molecule/tabs/clinicalQualityTab';
import StaffingTab from '../components/ui/molecule/tabs/staffingTab';
import FinancialOverviewTab from '../components/ui/molecule/tabs/financialOverviewTab';
import { Heading } from '../components/ui/atom/heading';
import { ProfilePageSkeleton } from '../components/ui/atom/skeletons.jsx';
import ListContainer, {
  ListContainerDivider,
} from '../components/ui/organism/ListContainer';
import OwnershipFlowDiagram from '../components/ui/organism/ownershipFlowDiagram';
import { OwnershipAndStakeholders } from '../components/ui/molecule/listContainerContent';
import AdditionalInformation from '../components/ui/molecule/additionalInformation';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * Facility profile page container.
 *
 * Responsibilities:
 * - Fetches facility data by route slug
 * - Renders profile header and tabbed content
 * - Shows ownership relationship sections and additional metadata
 */
export default function FacilityProfile() {
  const { slug } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nationalBenchmarks, setNationalBenchmarks] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Reload facility details whenever the URL slug changes.
    fetch(`${API_BASE_URL}/facilities/${slug}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const fetchNationalBenchmarks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/national`);
        const data = await res.json();
        setNationalBenchmarks(data);
      } catch (err) {
        console.error('Failed to fetch national averages:', err);
      }
    };

    fetchNationalBenchmarks();
  }, []);

  if (!facility && !loading) return <p role="alert">Facility not found.</p>;

  // Relationship records used for stakeholders + ownership diagram sections.
  const ownershipLinks = facility?.facility_ownership_links || [];

  //click handler to open the AI chat
  const handleResearchClick = () => {
    navigate(`/facilities/${slug}/research`);
  };

  // Builds the Home > All Nursing Homes > [Facility Name] trail; facility name falls back to '...' while loading.
  const breadcrumbPages = getFacilityProfilePages(slug, facility?.provider_name);

  return (
    <main className="bg-background-secondary font-sans">
      <Breadcrumb pages={breadcrumbPages} />
      <LayoutPage>
        {loading ? <ProfilePageSkeleton /> : <>
        <ProfileHeader
          title={facility.provider_name}
          ownershipType={facility.ownership_type}
          freshness={facility.data_freshness}
          func={getBadgeColorOwnershipType}
          onClick={handleResearchClick}
        />
        {/* Shared tab shell; active tab content is chosen in the render function below. */}
        <TabsShell
          tabsData={profileTabsDescriptions}
          defaultTabName={'Provider Highlights'}
        >
          {(activeTab) => {
            switch (activeTab.name) {
              case 'Provider Highlights':
                return (
                  <ProviderHighlights items={facility} status="facility" />
                );
              //As of 3/16/26 we are holding off on deficiencies
              //4/17 Tyler requested tab be visible with coming soon
              case 'Deficiencies & Penalties':
                return <DeficienciesTab items={facility} />;

              case 'Clinical Quality Measures':
                return (
                  <ClinicalQualityTab
                    metricsSource={facility}
                    status={'facility'}
                    nationalBenchmarks={nationalBenchmarks}
                  />
                );

              case 'Staffing':
                return <StaffingTab items={facility} status={'facility'} />;

              case 'Financial Overview':
                return (
                  <FinancialOverviewTab
                    items={facility}
                    status={'facility'}
                    nationalBenchmarks={nationalBenchmarks}
                  />
                );

              default:
                return (
                  <p className="text-muted-foreground text-sm">
                    This section is under development.
                  </p>
                );
            }
          }}
        </TabsShell>

        {/* Ownership details are shown only when linked ownership records exist. */}
        {ownershipLinks.length > 0 && (
          <>
            <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
              Ownership and Stakeholders
            </Heading>
            <ListContainer
              items={ownershipLinks}
              LayoutSelector={ListContainerDivider}
              ListContent={OwnershipAndStakeholders}
            />
            <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
              Ownership Diagram
            </Heading>
            <div className="pb-8">
              <OwnershipFlowDiagram
                items={ownershipLinks}
                facility={facility}
              />
            </div>
          </>
        )}

        {/* Bottom metadata panel for facility-level additional fields. */}
        <div className={ownershipLinks.length > 0 ? 'pb-8' : 'pt-8 pb-8'}>
          <AdditionalInformation items={facility} />
        </div>
        </>}
      </LayoutPage>
    </main>
  );
}
