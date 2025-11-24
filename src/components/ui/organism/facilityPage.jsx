import React from 'react';
import FacilityProviderHighlights from './facilityProviderHighlights';
import TabsWithHeader from '../molecule/tabsWithInfo';
import HeftiNavbar from '../molecule/heftiNavbar';
import LayoutPage from '../atom/layout-page';
import ProfileHeader from '../molecule/profileHeader';
/**
 * Top level componenent for Facilities Page
 */
export default function FacilityPage() {
  return (
    <div className="bg-background-secondary">
      <HeftiNavbar />
      <LayoutPage>
        <ProfileHeader />
        <TabsWithHeader />
        <FacilityProviderHighlights />
      </LayoutPage>
    </div>
  );
}
