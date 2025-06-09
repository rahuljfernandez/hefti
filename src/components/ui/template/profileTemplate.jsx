import React from 'react';
import LayoutPage from '../atom/layout-page';
import HeftiNavbar from '../molecule/heftiNavbar';
import ProfileHeader from '../molecule/profileHeader';
import TabsWithHeader from '../molecule/tabsWithHeader';
import Footer from '../molecule/footer';
import Breadcrumb from '../molecule/breadcrumb';
import LayoutCard from '../atom/layout-card';

const tabsData = [
  {
    name: '[selected tab]',
    displayTitle: '[selected tab]',
    href: '#',
  },
  {
    name: '[additional tab 1]',
    displayTitle: '[selected tab]',
    href: '#',
  },
  {
    name: '[additional tab 2]',
    displayTitle: '[selected tab]',
    href: '#',
  },
  {
    name: '[additional tab 3]',
    displayTitle: '[selected tab]',
    href: '#',
  },
  {
    name: '[additional tab 4]',
    displayTitle: '[selected tab]',
    href: '#',
  },
];

//This component is for storybook display only
//Not sure at this time if I need to make a reusable component out of the placeholder content below or a one time use?

export default function ProfileTemplate() {
  return (
    <div className="bg-background-secondary">
      <HeftiNavbar />
      <Breadcrumb />
      <LayoutPage>
        <ProfileHeader
          title={'[variable=Name]'}
          badges={[
            { title: '[variable=Ownership_Type]', color: 'zinc' },
            { title: '[BADGE TITLE]', color: 'zinc' },
            { title: '[BADGE TITLE]', color: 'zinc' },
          ]}
        />
        <TabsWithHeader tabsData={tabsData} />

        {/* Placeholder for Content */}
        <div className="mb-8">
          <LayoutCard>
            <div className="flex h-[620px] items-center justify-center bg-gray-100">
              <h1 className="text-display-sm text-content-tertiary">
                CORE CONTENT
              </h1>
            </div>
          </LayoutCard>
        </div>
      </LayoutPage>
      <Footer />
    </div>
  );
}
