import FacilityProviderHighlights from './facilityProviderHighlights';
import TabsWithHeader from '../molecule/tabsWithHeader';
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
        <ProfileHeader
          title={'Aspen Point Health and Rehabilitation'}
          badges={[
            { title: 'FOR PROFIT', color: 'cyan' },
            { title: 'INDIVIDUAL', color: 'orange' },
          ]}
        />
        <TabsWithHeader />
        <FacilityProviderHighlights />
      </LayoutPage>
    </div>
  );
}
