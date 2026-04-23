import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Presentational tab selector used by TabsShell.
 *
 * Responsibilities:
 * - Renders the tab navigation UI for mobile and desktop layouts
 * - Receives the current active tab from its parent
 * - Notifies the parent when the user selects a different tab
 *
 * This component does not own tab state. TabsShell is responsible for choosing
 * the active tab and rendering the matching tab content.
 */

export default function TabsSelector({
  tabsData = [],
  onTabChange,
  activeTab,
  panelId,
  getTabId,
}) {
  const handleClick = (tabName) => {
    const newActive = tabsData.find((tab) => tab.name === tabName);
    if (newActive) onTabChange?.(newActive);
  };

  return (
    <div className="bg-background-secondary">
      {/** Mobile */}
      <div className="grid grid-cols-1 lg:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab. */}
        <select
          onChange={(e) => handleClick(e.target.value)}
          value={activeTab?.name}
          aria-label="Select a tab"
          className="text-paragraph-sm col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-700"
        >
          {tabsData.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      {/** Desktop */}
      <div className="hidden lg:block">
        <div className="border-b border-gray-200">
          <div
            role="tablist"
            aria-label="Tabs"
            className="-mb-px flex space-x-8"
          >
            {tabsData.map((tab) => (
              <button
                type="button"
                key={tab.name}
                id={getTabId?.(tab.name)}
                role="tab"
                aria-selected={activeTab?.name === tab.name}
                aria-controls={panelId}
                tabIndex={0}
                onClick={() => handleClick(tab.name)}
                className={classNames(
                  activeTab?.name === tab.name
                    ? 'border-blue-700 font-bold text-blue-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'text-paragraph-sm focus-visible:outline-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer border-b-2 px-1 py-4 whitespace-nowrap',
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

TabsSelector.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
      current: PropTypes.bool,
      displayTitle: PropTypes.string,
    }),
  ),
  onTabChange: PropTypes.func,
  panelId: PropTypes.string,
  getTabId: PropTypes.func,
  activeTab: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string,
    current: PropTypes.bool,
    displayTitle: PropTypes.string,
  }),
};
