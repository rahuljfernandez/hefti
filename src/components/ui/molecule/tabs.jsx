import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

Tabs.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
      current: PropTypes.bool,
      displayTitle: PropTypes.string,
    }),
  ),
  onTabChange: PropTypes.func,
  activeTab: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string,
    current: PropTypes.bool,
    displayTitle: PropTypes.string,
  }),
};

/**
 *
 * This component is based on UI/Application Tabs/Tabs with underline
 * Props:
 * - tabsData: array of tabs
 * - activeTab: the currently active tab
 * - onTabChange: callback when a tab is clicked
 * example:  <Tabs tabsData={tabsData} onTabChange={setActiveTab} activeTab={activeTab}/>
 */

export default function Tabs({ tabsData = [], onTabChange, activeTab }) {
  const handleClick = (tabName) => {
    const newActive = tabsData.find((tab) => tab.name === tabName);
    if (newActive) {
      onTabChange?.(newActive);
    }
  };

  console.log(activeTab.name);
  return (
    <div className="bg-background-secondary">
      <div className="grid grid-cols-1 sm:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
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
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabsData.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(tab.name);
                }}
                aria-current={activeTab.name === tab.name ? 'page' : undefined}
                className={classNames(
                  activeTab?.name === tab.name
                    ? 'border-blue-700 font-bold text-blue-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'text-paragraph-sm border-b-2 px-1 py-4 whitespace-nowrap',
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* {activeTab && (
        <SectionHeader title={activeTab.displayTitle} variant="primary" />
      )} */}
    </div>
  );
}
