import React, { useState, useMemo } from 'react';
import NetworkSidePanelAccordion from './networkSidePanelAccordion';
import {
  MetricCardShort,
  NetworkSidePanelList,
  StaffingCardShort,
} from './listContainerContent';
import {
  buildOwnerLongStayStats,
  buildOwnerShortStayStats,
} from '../../../lib/clinicalQualityMetrics';
import {
  buildOwnerStaffingLevels,
  buildOwnerStaffingTurnover,
} from '../../../lib/staffingMetrics';
import {
  buildOwnerProfitStats,
  buildOwnerRevenueStats,
  buildOwnerExpensesStats,
  buildOwnerLiquidityStats,
} from '../../../lib/financialMetrics';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useTabKeyNavigation from '../../../hooks/useTabKeyNavigation';

/**
 * Scrollable content body for a selected owner node in the network graph.
 *
 * Responsibilities:
 * - Renders Ownership Relations Count accordion for hub nodes only
 * - Renders Clinical Quality Measures, Staffing, and Financial Overview
 *   accordions for all nodes, each with tabbed sub-categories
 * - Passes `variant` down so cards adapt between desktop and mobile styles
 *
 * Notes:
 * - Hub nodes open the Ownership Relations accordion by default; non-hub nodes
 *   open Clinical Quality Measures by default instead.
 * - `meta` is the raw node metadata from the graph API; builders derive display
 *   values from it. If `meta` is null all values render as N/A.
 */
export default function OwnerNetworkContent({
  mode,
  shared,
  onSelectNode,
  variant,
  meta,
}) {
  const isHub = mode === 'hub';
  const [activeTab, setActiveTab] = useState('long');
  const [activeStaffingTab, setActiveStaffingTab] = useState('levels');
  const [activeFinancialTab, setActiveFinancialTab] = useState('profit');

  // Memoized by `meta` so builders don't re-run on unrelated re-renders.
  const allMetrics = useMemo(() => ({
    long: buildOwnerLongStayStats(meta),
    short: buildOwnerShortStayStats(meta),
  }), [meta]);

  const allStaffingMetrics = useMemo(() => ({
    levels: buildOwnerStaffingLevels(meta),
    turnover: buildOwnerStaffingTurnover(meta),
  }), [meta]);

  const allFinancialMetrics = useMemo(() => ({
    profit: buildOwnerProfitStats(meta),
    revenue: buildOwnerRevenueStats(meta),
    expenses: buildOwnerExpensesStats(meta),
    liquidity: buildOwnerLiquidityStats(meta),
  }), [meta]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {/* Hub only: list of co-owned facilities shared with other operators. */}
      {isHub && (
        <NetworkSidePanelAccordion
          title="Ownership Relations Count"
          defaultOpen
          variant={variant}
        >
          <div className="max-h-64 overflow-y-auto">
            <ul aria-label="Ownership relations" className="mt-2 rounded-lg">
              {shared.map((owner) => (
                <li key={owner.ownerId}>
                  <NetworkSidePanelList
                    item={owner}
                    onSelectNode={onSelectNode}
                    variant={variant}
                  />
                </li>
              ))}
            </ul>
          </div>
        </NetworkSidePanelAccordion>
      )}

      {/* Non-hub nodes open CQM by default; hub nodes collapse it to save space. */}
      <NetworkSidePanelAccordion
        title="Clinical Quality Measures"
        defaultOpen={!isHub}
        variant={variant}
      >
        <TabbedMetricList
          tabs={[
            { value: 'long', label: 'Long Stay' },
            { value: 'short', label: 'Short Stay' },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          items={allMetrics[activeTab]}
          CardComponent={MetricCardShort}
          variant={variant}
        />
      </NetworkSidePanelAccordion>

      <NetworkSidePanelAccordion title="Staffing" variant={variant}>
        <TabbedMetricList
          tabs={[
            { value: 'levels', label: 'Levels' },
            { value: 'turnover', label: 'Turnover' },
          ]}
          activeTab={activeStaffingTab}
          setActiveTab={setActiveStaffingTab}
          items={allStaffingMetrics[activeStaffingTab]}
          CardComponent={StaffingCardShort}
          variant={variant}
        />
      </NetworkSidePanelAccordion>

      <NetworkSidePanelAccordion title="Financial Overview" variant={variant}>
        <TabbedMetricList
          tabs={[
            { value: 'profit', label: 'Profit' },
            { value: 'revenue', label: 'Revenue' },
            { value: 'expenses', label: 'Expenses' },
            { value: 'liquidity', label: 'Liquidity' },
          ]}
          activeTab={activeFinancialTab}
          setActiveTab={setActiveFinancialTab}
          items={allFinancialMetrics[activeFinancialTab]}
          CardComponent={MetricCardShort}
          variant={variant}
        />
      </NetworkSidePanelAccordion>
    </div>
  );
}

/**
 * Reusable tabbed list used by each metric accordion section.
 *
 * Responsibilities:
 * - Renders a fully accessible ARIA tablist with roving tabindex keyboard nav
 * - Swaps the visible card list when the active tab changes
 * - Accepts a `CardComponent` prop so callers control the card layout
 *
 * Notes:
 * - `panelId` is derived from the first tab's value so it stays stable across
 *   tab switches — changing it would break the aria-controls association.
 * - Keyboard navigation (Arrow keys, Home, End) is handled by useTabKeyNavigation.
 */
function TabbedMetricList({
  tabs,
  activeTab,
  setActiveTab,
  items,
  CardComponent,
  variant,
}) {
  // Stable ID: must not include activeTab or it breaks aria-controls on every switch.
  const panelId = `tabpanel-${tabs[0]?.value}`;
  const { tabRefs, handleKeyDown } = useTabKeyNavigation(tabs, (nextTab) =>
    setActiveTab(nextTab.value),
  );

  return (
    <div className={variant === 'mobile' ? 'bg-zinc-900' : 'bg-white'}>
      <div
        role="tablist"
        aria-label="Metric category"
        className="border-border-primary flex gap-2 border-b px-4 py-2"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={panelId}
            tabIndex={activeTab === tab.value ? 0 : -1}
            onClick={() => setActiveTab(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={clsx(
              'text-label-xs border-border-primary text-core-black flex-1 rounded-md border py-1 transition hover:cursor-pointer',
              activeTab === tab.value
                ? 'bg-zinc-200'
                : 'bg-zinc-100 hover:bg-zinc-50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-label={tabs.find((t) => t.value === activeTab)?.label}
        tabIndex={0}
        className="max-h-64 overflow-y-auto"
      >
        <ul aria-label="Metrics">
          {items.map((item) => (
            <li key={item.id}>
              <CardComponent item={item} variant={variant} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

TabbedMetricList.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  CardComponent: PropTypes.elementType.isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

OwnerNetworkContent.propTypes = {
  mode: PropTypes.oneOf(['hub', 'non-hub']).isRequired,
  meta: PropTypes.object,
  shared: PropTypes.arrayOf(
    PropTypes.shape({
      ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      ownerName: PropTypes.string,
      count: PropTypes.number,
      cms_ownership_type: PropTypes.string,
    }),
  ),
  onSelectNode: PropTypes.func,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

OwnerNetworkContent.defaultProps = {
  shared: [],
  meta: null,
  onSelectNode: undefined,
};
