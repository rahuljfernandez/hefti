import React, { useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import StarRating from './starRating';
import { Badge } from '../atom/badge';
import { getBadgeColorOwnerProfile } from '../../../lib/getBadgeColor';
import NetworkSidePanelCardHeader from '../molecule/networkSidePanelCardHeader';
import NetworkSidePanelSection from './networkSidePanelAccordian';
import { NetworkSidePanelList } from './listContainerContent';

export default function OwnerNetworkSidePanel({
  data,
  selectedNodeId,
  onClear,
  onSelectNode,
}) {
  const selectedNode = useMemo(() => {
    if (!data?.nodes?.length || !selectedNodeId) return null;
    return (
      data.nodes.find((n) => String(n.id) === String(selectedNodeId)) ?? null
    );
  }, [data, selectedNodeId]);

  if (!selectedNodeId) return null;
  console.log(selectedNode);

  return (
    <div className="flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-hidden md:w-[375px] xl:w-[450px]">
      {selectedNode.type === 'hub' ? (
        <HubPanel
          selectedNode={selectedNode}
          onClear={onClear}
          onSelectNode={onSelectNode}
        />
      ) : (
        <OwnerPanel selectedNode={selectedNode} onClear={onClear} />
      )}
    </div>
  );
}
//side panel for all nodes other than hub
function OwnerPanel({ selectedNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <NetworkSidePanelCardHeader selectedNode={selectedNode} />

      <NetworkSidePanelSection title="Clinical Quality Measures">
        {' '}
        {/**Children */}
      </NetworkSidePanelSection>
      <NetworkSidePanelSection title="Staffing">
        {/**Children */}{' '}
      </NetworkSidePanelSection>
    </div>
  );
}

//side panel for only Hub node
function HubPanel({ selectedNode, onSelectNode }) {
  const shared = selectedNode?.meta?.sharedFacilities ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <NetworkSidePanelCardHeader selectedNode={selectedNode} />
      <NetworkSidePanelSection title="Ownership Relations Count" defaultOpen>
        {/**Children */}
        <div className="bg-core-white max-h-64 overflow-y-auto px-4">
          <ul className="mt-2 rounded-lg">
            {shared.map((owner) => (
              <li key={owner.ownerId}>
                <NetworkSidePanelList
                  item={owner}
                  onSelectNode={onSelectNode}
                />
              </li>
            ))}
          </ul>
        </div>
      </NetworkSidePanelSection>
      <NetworkSidePanelSection title="Clinical Quality Measures">
        {' '}
        {/**Children */}
      </NetworkSidePanelSection>
      <NetworkSidePanelSection title="Staffing">
        {/**Children */}{' '}
      </NetworkSidePanelSection>
    </div>
  );
}
