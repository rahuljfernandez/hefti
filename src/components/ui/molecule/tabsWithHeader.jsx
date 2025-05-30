import { useState } from 'react';
import SectionHeader from '../atom/sectionHeader';
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

export default function TabsWithHeader() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  return (
    <div className="bg-background-secondary">
      <Tabs tabsData={TABS} onTabChange={setActiveTab} />
      <div className="py-6">
        <SectionHeader title={activeTab.displayTitle} variant="primary" />
      </div>
    </div>
  );
}
