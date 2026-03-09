import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from './Tabs';

/**
 * Shared tabs wrapper for profile pages.
 *
 * Responsibilities:
 * - Owns `activeTab` selection state
 * - Renders the shared `Tabs` UI
 * - Exposes the selected tab through a render prop (`children(activeTab)`)
 *
 * Notes:
 * - If `defaultTabName` is provided, it attempts to start on that tab.
 * - If no render function is passed as `children`, a fallback message is shown.
 */

export default function TabsWithInfo({
  tabsData,
  defaultTabName,
  children,
  onTabChange,
}) {
  const initialTab =
    tabsData.find((tab) => tab.name === defaultTabName) ?? tabsData[0];

  const [activeTab, setActiveTab] = useState(initialTab);

  // Updates local tab state and notifies the parent when tab selection changes.
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <Tabs
          tabsData={tabsData}
          onTabChange={handleTabChange}
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
  onTabChange: PropTypes.func,
};
