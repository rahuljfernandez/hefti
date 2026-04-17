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
      {isHub ? (
        <>
          <NetworkSidePanelAccordion
            title="Ownership Relations Count"
            defaultOpen
            variant={variant}
          >
            {/**Children */}
            <div className="max-h-64 overflow-y-auto">
              <ul className="mt-2 rounded-lg">
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
          <NetworkSidePanelAccordion
            title="Clinical Quality Measures"
            variant={variant}
          >
            <TabbedMetricList
              tabs={[{ value: 'long', label: 'Long Stay' }, { value: 'short', label: 'Short Stay' }]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={metrics}
              CardComponent={MetricCardShort}
              variant={variant}
            />
          </NetworkSidePanelAccordion>
          <NetworkSidePanelAccordion title="Staffing" variant={variant}>
            <TabbedMetricList
              tabs={[{ value: 'levels', label: 'Levels' }, { value: 'turnover', label: 'Turnover' }]}
              activeTab={activeStaffingTab}
              setActiveTab={setActiveStaffingTab}
              items={staffingMetrics}
              CardComponent={StaffingCardShort}
              variant={variant}
            />
          </NetworkSidePanelAccordion>
        </>
      ) : (
        <>
          <NetworkSidePanelAccordion
            title="Clinical Quality Measures"
            variant={variant}
          >
            <ClinicalQualityContent
              metrics={metrics}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </NetworkSidePanelAccordion>
          <NetworkSidePanelAccordion title="Staffing" variant={variant}>
            <TabbedMetricList
              tabs={[{ value: 'levels', label: 'Levels' }, { value: 'turnover', label: 'Turnover' }]}
              activeTab={activeStaffingTab}
              setActiveTab={setActiveStaffingTab}
              items={staffingMetrics}
              CardComponent={StaffingCardShort}
              variant={variant}
            />
          </NetworkSidePanelAccordion>
        </>
      )}
    </>
  );
}

function TabbedMetricList({ tabs, activeTab, setActiveTab, items, CardComponent, variant }) {
  return (
    <div>
      <div className="flex border-b border-gray-200 px-4 pt-1 pb-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded px-3 py-1 text-sm font-medium ${i < tabs.length - 1 ? 'mr-2' : ''} ${
              activeTab === tab.value
                ? 'bg-core-black text-core-white'
                : 'text-content-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto">
        <ul>
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
