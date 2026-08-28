import React from 'react';
import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useSearchParams } from 'react-router-dom';
import TabsSelector from './tabsSelector';
import { slugify } from '../../../lib/slugify';

/**
 * Stateful wrapper around the tab selector.
 * It owns the active tab and passes the selected tab back to the page via render props.
 *
 * Pass `urlParam` to keep the active tab in that search param instead of local
 * state, which makes tabs linkable and survives the parent unmounting the shell
 * while it refetches. Opt-in because nested shells would otherwise fight over
 * the same key — the profile pages render one inside their own first tab.
 */
export default function TabsShell({
  tabsData,
  defaultTabName,
  urlParam,
  children,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation();

  // Prefer the requested default tab when present; otherwise fall back to the first tab.
  const defaultTab =
    tabsData.find((tab) => tab.name === defaultTabName) ?? tabsData[0];
  const [localTab, setLocalTab] = useState(defaultTab);

  const tabFromUrl = urlParam
    ? tabsData.find((tab) => slugify(tab.name) === searchParams.get(urlParam))
    : null;
  const activeTab = urlParam ? (tabFromUrl ?? defaultTab) : localTab;

  const handleTabChange = (tab) => {
    if (!urlParam) {
      setLocalTab(tab);
      return;
    }
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set(urlParam, slugify(tab.name));
        return next;
      },
      // Carries location state forward; the facility breadcrumbs read state.from.
      { state },
    );
  };

  const tabSetId = useId().replace(/:/g, '');
  const panelId = `${tabSetId}-panel`;
  const getTabId = (tabName) =>
    `${tabSetId}-tab-${tabsData.findIndex((tab) => tab.name === tabName)}`;

  return (
    <div className="bg-background-secondary">
      <div className="pb-3">
        <TabsSelector
          tabsData={tabsData}
          onTabChange={handleTabChange}
          activeTab={activeTab}
          panelId={panelId}
          getTabId={getTabId}
        />
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={getTabId(activeTab?.name)}
      >
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
  urlParam: PropTypes.string,
  children: PropTypes.func,
};
