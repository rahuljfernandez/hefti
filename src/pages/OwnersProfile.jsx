import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';
import { Heading } from '../components/ui/atom/heading';
import OwenerProviderHighlights from '../components/ui/organism/ownerProviderHighlights';
import ListContainer from '../components/ui/organism/listContainer';
import { ListContainerDivider } from '../components/ui/organism/listContainer';
import { RelatedFacilities } from '../components/ui/molecule/listContainerContent';
import { getBadgeColorOwnerProfile } from '../lib/getBadgeColor';
import { toTitleCase } from '../lib/toTitleCase';

/**
 * OwnerProfile serves as the page for specific owners
 *
 *
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

export default function OwnersProfile() {
  const { slug } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/owners/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setOwner(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading owner details...</p>;
  if (!owner) return <p>Owner not found.</p>;

  console.log('owner', owner);
  // Use related facilities from API if available
  const relatedFacilities =
    owner.facility_ownership_links?.map((link) => ({
      ...link.facility,
      cms_ownership_role: link.cms_ownership_role,
    })) || [];

  return (
    <div className="bg-background-secondary">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={toTitleCase(owner.cms_ownership_name)}
          ownershipType={owner.cms_ownership_type}
          freshness={relatedFacilities[0].data_freshness}
          func={getBadgeColorOwnerProfile}
        />
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Owner Highlights
        </Heading>
        <OwenerProviderHighlights
          items={owner}
          relatedFacilities={relatedFacilities}
        />
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
            >
              Load All Facilities
            </button>
          </div>
        )}
      </LayoutPage>
    </div>
  );
}
