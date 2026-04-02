import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from './Tabs';

export default function TabsWithInfo({ tabsData, defaultTabName, children }) {
  const defaultTab = tabsData.find((t) => t.name === defaultTabName) ?? tabsData[0];
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <Tabs
          tabsData={tabsData}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        />
      </div>

      <div>
        {typeof children === 'function' ? (
          children(activeTab)
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
      displayTitle: PropTypes.string,
      href: PropTypes.string,
    }),
  ).isRequired,
  defaultTabName: PropTypes.string,
  children: PropTypes.func,
};
