import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../molecule/sectionHeader';
import Tabs from './Tabs';

const TABS = [
  {
    name: 'Provider Highlights & Ownership',
    displayTitle: 'Provider Highlights',
    href: '#',
  },
  {
    name: 'Deficiencies & Penalties',
    displayTitle: 'Deficiencies from Inspection Reports',
    href: '#',
  },
  {
    name: 'Clinical Quality Measures',
    displayTitle: 'Clinical Quality Measures',
    href: '#',
  },
  {
    name: 'Staffing',
    displayTitle: 'Staffing Quality',
    href: '#',
  },
  {
    name: 'Financial Overview',
    displayTitle: 'Financial Snapshot',
    href: '#',
  },
];

/**
 *We manage the activeTab state here witch sets the default to the first tab.  This is passed down to the Tabs component.
 */

export default function TabsWithHeader({ tabsData = TABS }) {
  const [activeTab, setActiveTab] = useState(tabsData[0]);
  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <Tabs
          tabsData={tabsData}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="py-6">
        <SectionHeader title={activeTab.displayTitle} variant="primary" />
      </div>
    </div>
  );
}

TabsWithHeader.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayTitle: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ),
};
