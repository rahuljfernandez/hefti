import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';
import FacilityProviderHighlights from '../components/ui/organism/facilityProviderHighlights';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { Heading } from '../components/ui/atom/heading';
import OwnershipFlowDiagram from '../components/ui/organism/ownershipFlowDiagram';
import { OwnershipAndStakeholders } from '../components/ui/molecule/listContainerContent';
import ListContainer, {
  ListContainerDivider,
} from '../components/ui/organism/ListContainer';
import AdditionalInformation from '../components/ui/molecule/additionalInformation';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

export default function FacilityProfile() {
  const { slug } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/facilities/${slug}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading facility details...</p>;
  if (!facility) return <p>Facility not found.</p>;

  // Use real ownership data from facility
  const ownershipLinks = facility.facility_ownership_links || [];

  return (
    <div className="bg-background-secondary font-sans">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={facility.provider_name}
          ownershipType={facility.ownership_type}
          freshness={facility.data_freshness}
        />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Provider Highlights
        </Heading>
        <FacilityProviderHighlights items={facility} />

        {ownershipLinks.length > 0 && (
          <>
            <Heading level={2} className="text-heading-sm mt-8 mb-4">
              Ownership and Stakeholders
            </Heading>
            <ListContainer
              items={ownershipLinks}
              LayoutSelector={ListContainerDivider}
              ListContent={OwnershipAndStakeholders}
            />
            <Heading level={2} className="text-heading-sm mt-8 mb-4">
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

        <div className={ownershipLinks.length > 0 ? 'pb-8' : 'pt-8 pb-8'}>
          <AdditionalInformation items={facility} />
        </div>
      </LayoutPage>
    </div>
  );
}
