import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';
import { Heading } from '../components/ui/atom/heading';
import ProviderHighlights from '../components/ui/organism/providerHighlights';
import ListContainer from '../components/ui/organism/ListContainer';
import { ListContainerDivider } from '../components/ui/organism/ListContainer';
import { RelatedFacilities } from '../components/ui/molecule/listContainerContent';
import { getBadgeColorOwnerProfile } from '../lib/getBadgeColor';
import { toTitleCase } from '../lib/toTitleCase';
import OwnersNetworkGraphLauncher from '../components/ui/molecule/ownerNetworkGraphLauncher';
import TabsShell from '../components/ui/molecule/tabsShell';
import { profileTabsDescriptions } from '../lib/tabDescriptions';
import DeficienciesTab from '../components/ui/molecule/tabs/deficienciesTab';
import ClinicalQualityTab from '../components/ui/molecule/tabs/clinicalQualityTab';
import StaffingTab from '../components/ui/molecule/tabs/staffingTab';
import FinancialOverviewTab from '../components/ui/molecule/tabs/financialOverviewTab';

/**
 * Owner profile page container.
 *
 * Responsibilities:
 * - Fetches owner data by route slug
 * - Renders the owner profile header and tabbed content
 * - Derives the related facilities list from ownership links
 * - Shows the associated facilities section and load-more behavior
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

export default function OwnersProfile() {
  const { slug } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  console.log(slug);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/owners/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setOwner(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <p role="status" aria-live="polite">
        Loading owner details...
      </p>
    );
  }
  if (!owner) return <p role="alert">Owner not found.</p>;

  // Use related facilities from API if available
  const relatedFacilities =
    owner.facility_ownership_links?.map((link) => ({
      ...link.facility,
      cms_ownership_role: link.cms_ownership_role,
    })) || [];

  //click handler to open the AI chat
  const handleResearchClick = () => {
    navigate(`/owners/${slug}/research`);
  };

  // Use the first facility's freshness as a proxy for the owner-level data freshness.
  const freshness = relatedFacilities[0]?.data_freshness;

  return (
    <main className="bg-background-secondary">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={toTitleCase(owner.cms_ownership_name)}
          ownershipType={owner.cms_ownership_type}
          freshness={freshness}
          func={getBadgeColorOwnerProfile}
          onClick={handleResearchClick}
        />
        <OwnersNetworkGraphLauncher ownerId={owner.id} />
        {/* Shared tab shell; active tab content is chosen in the render function below. */}
        <TabsShell
          tabsData={profileTabsDescriptions}
          defaultTabName={'Provider Highlights'}
        >
          {(activeTab) => {
            switch (activeTab.name) {
              case 'Provider Highlights':
                return <ProviderHighlights items={owner} status="owner" />;
              //As of 3/16/26 we are holding off on deficiencies
              //4/17 Tyler requested tab be visible with coming soon
              case 'Deficiencies & Penalties':
                return <DeficienciesTab items={owner} />;

              case 'Clinical Quality Measures':
                return (
                  <ClinicalQualityTab metricsSource={owner} status={'owner'} />
                );

              case 'Staffing':
                return <StaffingTab items={owner} status={'owner'} />;

              case 'Financial Overview':
                return <FinancialOverviewTab items={owner} status={'owner'} />;

              default:
                return (
                  <p className="text-muted-foreground text-sm">
                    This section is under development.
                  </p>
                );
            }
          }}
        </TabsShell>

        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Facilities associated with {toTitleCase(owner.cms_ownership_name)}
        </Heading>

        <div className="pb-8">
          <ListContainer
            items={showAll ? relatedFacilities : relatedFacilities.slice(0, 20)}
            LayoutSelector={ListContainerDivider}
            ListContent={RelatedFacilities}
          />
        </div>
        {!showAll && relatedFacilities.length > 20 && (
          <div className="pb-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-paragraph-base cursor-pointer text-blue-700 underline hover:text-blue-800"
              aria-label={`Show all ${relatedFacilities.length} facilities`}
              aria-expanded={showAll}
            >
              Load All Facilities
            </button>
          </div>
        )}
      </LayoutPage>
    </main>
  );
}
