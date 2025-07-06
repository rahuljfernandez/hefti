import { useParams } from 'react-router-dom';
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

/**
 * FacilityProfile serves as the landing page for specific nursing home facilities
 * Todo:
 * Pass facility into ownershipFlowDigagram then link up the values
 */

//short term hard coded data
const dummyOwnershipData = [
  {
    name: 'Vhs Mo Opco Holdings Llc',
    type: 'Organization',
    role: 'Direct Ownership',
    percentage: '100%',
    ownership: '5% or Greater Indirect Ownership Interest',
  },
  {
    name: 'Vertical Health Services Llc',
    type: 'Organization',
    role: 'Indirect Ownership',
    percentage: 'No percentage provided',
    ownership: '5% or Greater Indirect Ownership Interest',
  },
  {
    name: 'William Miller',
    type: 'Individual',
    role: 'Corporate Officer',
    percentage: 'No percentage provided',
    ownership: '5% or Greater Indirect Ownership Interest',
  },
  {
    name: 'Keesha Robinson',
    type: 'Individual',
    role: 'Managing Employee',
    percentage: 'No percentage provided',
    ownership: '5% or Greater Indirect Ownership Interest',
  },
];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

export default function FacilityProfile() {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/facilities/${id}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading facility details...</p>;
  if (!facility) return <p>Facility not found.</p>;

  return (
    <div className="bg-background-secondary">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={facility.name}
          badges={[{ title: facility.ownership.ownership_type, color: 'cyan' }]}
        />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Provider Highlights
        </Heading>
        <FacilityProviderHighlights items={facility} />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Ownership and Stakeholders
        </Heading>
        <ListContainer
          items={dummyOwnershipData}
          LayoutSelector={ListContainerDivider}
          ListContent={OwnershipAndStakeholders}
        />
        <Heading level={2} className="text-heading-sm mt-8 mb-4">
          Ownership Diagram
        </Heading>
        <div className="pb-8">
          <OwnershipFlowDiagram />
        </div>
        <div className="pb-8">
          <AdditionalInformation />
        </div>
      </LayoutPage>
    </div>
  );
}
