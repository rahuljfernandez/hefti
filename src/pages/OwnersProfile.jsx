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

  useEffect(() => {
    fetch(`${API_BASE_URL}/owners/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setOwner(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading owner details...</p>;
  if (!owner) return <p>Owner not found.</p>;

  // Use related facilities from API if available
  const relatedFacilities = owner.facility_ownership_links?.map(link => link.facility) || [];

  return (
    <div className="bg-background-secondary">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={owner.cms_ownership_name}
          badges={[
            { title: owner.cms_ownership_type, color: 'cyan' },
          ]}
        />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Owner Highlights
        </Heading>
        <OwenerProviderHighlights items={owner} />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Facilities owned by {owner.cms_ownership_name}
        </Heading>
        <div className="pb-8">
          <ListContainer
            items={relatedFacilities}
            LayoutSelector={ListContainerDivider}
            ListContent={RelatedFacilities}
          />
        </div>
      </LayoutPage>
    </div>
  );
}
