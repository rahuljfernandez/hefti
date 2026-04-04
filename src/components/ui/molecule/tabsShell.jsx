import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TabsSelector from './tabsSelector';

/**
 * Stateful wrapper around the tab selector.
 * It owns the active tab and passes the selected tab back to the page via render props.
 */
export default function TabsShell({ tabsData, defaultTabName, children }) {
  // Prefer the requested default tab when present; otherwise fall back to the first tab.
  const defaultTab =
    tabsData.find((tab) => tab.name === defaultTabName) ?? tabsData[0];
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <TabsSelector
          tabsData={tabsData}
          onTabChange={setActiveTab}
          activeTab={activeTab}
        />
      </div>

      <div>
        {/* The parent page decides what to render for the selected tab by passing a render function.
        We call that function with the current active tab so each page can map tab names to its own content. */}
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

TabsShell.propTypes = {
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
