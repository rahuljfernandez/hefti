import React, { useState } from 'react';
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

  const metrics = {
    long: buildOwnerLongStayStats(meta),
    short: buildOwnerShortStayStats(meta),
  }[activeTab];

  const staffingMetrics = {
    levels: buildOwnerStaffingLevels(meta),
    turnover: buildOwnerStaffingTurnover(meta),
  }[activeStaffingTab];

  const financialMetrics = {
    profit: buildOwnerProfitStats(meta),
    revenue: buildOwnerRevenueStats(meta),
    expenses: buildOwnerExpensesStats(meta),
    liquidity: buildOwnerLiquidityStats(meta),
  }[activeFinancialTab];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
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
          items={metrics}
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
          items={staffingMetrics}
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
          items={financialMetrics}
          CardComponent={MetricCardShort}
          variant={variant}
        />
      </NetworkSidePanelAccordion>
    </div>
  );
}

function TabbedMetricList({
  tabs,
  activeTab,
  setActiveTab,
  items,
  CardComponent,
  variant,
}) {
  const panelId = `tabpanel-${tabs[0]?.value}-${activeTab}`;
  const { tabRefs, handleKeyDown } = useTabKeyNavigation(
    tabs,
    (nextTab) => setActiveTab(nextTab.value),
  );

  return (
    <div className="bg-white">
      <div
        role="tablist"
        aria-label="Metric category"
        className="border-border-primary flex gap-2 border-b px-4 py-2"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(el) => { tabRefs.current[index] = el; }}
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
