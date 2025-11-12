import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';

import Breadcrumb from '../components/ui/molecule/breadcrumb';

import { getBadgeColorOwnershipType } from '../lib/getBadgeColor';

import { facilityProfileTabsDescriptions } from '../lib/tabDescriptions';
import TabsWithInfo from '../components/ui/molecule/tabsWithInfo';

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
  console.log('links', facility);
  return (
    <div className="bg-background-secondary font-sans">
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={facility.provider_name}
          ownershipType={facility.ownership_type}
          freshness={facility.data_freshness}
          func={getBadgeColorOwnershipType}
        />
        <TabsWithInfo
          tabsData={facilityProfileTabsDescriptions}
          facility={facility}
          ownershipLinks={ownershipLinks}
        />
      </LayoutPage>
    </div>
  );
}
