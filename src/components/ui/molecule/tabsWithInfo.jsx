import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from './Tabs';
import ClinicalQualityTab from './tabs/clinicalQualityTab';
import DeficienciesTab from './tabs/deficienciesTab';
import FinancialOverviewTab from './tabs/financialOverviewTab';
import ProviderHighlightsOwnershipTab from './tabs/providerHighlightsOwnershipTab';
import StaffingTab from './tabs/staffingTab';

// We manage the activeTab state here which sets the default to the first tab (Provider Highlights & Ownership) . This is passed down to the Tabs component.

// The five imported tab components are stored in TAB_COMPONENTS, which maps each tab's name to its corresponding component. When a user clicks a tab (e.g., "Financial Overview"), activeTab.name updates, and the matching component (FinancialOverviewTab) is dynamically rendered.

const TAB_COMPONENTS = {
  'Provider Highlights & Ownership': ProviderHighlightsOwnershipTab,
  'Deficiencies & Penalties': DeficienciesTab,
  'Clinical Quality Measures': ClinicalQualityTab,
  Staffing: StaffingTab,
  'Financial Overview': FinancialOverviewTab,
};

export default function TabsWithInfo({ tabsData, facility, ownershipLinks }) {
  const [activeTab, setActiveTab] = useState(tabsData[0]);
  const ActiveComponent = TAB_COMPONENTS[activeTab.name];

  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <Tabs
          tabsData={tabsData}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="">
        {ActiveComponent ? (
          <ActiveComponent
            facility={facility}
            ownershipLinks={ownershipLinks}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            This section is under development.
          </p>
        )}
      </div>
    </div>
  );
}

TabsWithInfo.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      displayTitle: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ),
  facility: PropTypes.object,
  ownershipLinks: PropTypes.array,
};
