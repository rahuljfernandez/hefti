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
import PropTypes from 'prop-types';
import clsx from 'clsx';

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

  const metrics =
    activeTab === 'long'
      ? buildOwnerLongStayStats(meta)
      : buildOwnerShortStayStats(meta);

  const staffingMetrics =
    activeStaffingTab === 'levels'
      ? buildOwnerStaffingLevels(meta)
      : buildOwnerStaffingTurnover(meta);

  return (
    <>
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
    </>
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

  return (
    <div className="bg-white">
      <div
        role="tablist"
        aria-label="Metric category"
        className="border-border-primary flex gap-2 border-b px-4 py-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={panelId}
            tabIndex={activeTab === tab.value ? 0 : -1}
            onClick={() => setActiveTab(tab.value)}
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
