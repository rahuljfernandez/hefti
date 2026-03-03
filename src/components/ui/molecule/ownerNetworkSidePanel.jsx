import React, { useMemo } from 'react';
import NetworkSidePanelCardHeader from '../molecule/networkSidePanelCardHeader';
import NetworkSidePanelSection from './networkSidePanelAccordian';
import { NetworkSidePanelList } from './listContainerContent';
import PropTypes from 'prop-types';
import NetworkFilter from './networkFilter';

/**
 * Side panel shown beside the owner network graph.
 *
 * Responsibilities:
 * - Resolves the currently selected graph node from the loaded network data
 * - Chooses the correct panel layout for hub vs. non-hub nodes
 *
 * Props:
 * - data: Network payload containing the graph nodes used to resolve the selection
 * - selectedNodeId: Active node id from graph interactions or search
 * - onClear: Reserved clear handler passed down from the modal
 * - onSelectNode: Selects a related node from the hub panel list
 */
export default function OwnerNetworkSidePanel({
  data,
  selectedNodeId,

  onSelectNode,
}) {
  const selectedNode = useMemo(() => {
    if (!data?.nodes?.length || !selectedNodeId) return null;
    return (
      data.nodes.find((n) => String(n.id) === String(selectedNodeId)) ?? null
    );
  }, [data, selectedNodeId]);

  if (!selectedNodeId || !selectedNode) return null;

  return (
    <div className="border-border-primary flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-hidden border xl:w-[375px]">
      {selectedNode.type === 'hub' ? (
        <HubPanel selectedNode={selectedNode} onSelectNode={onSelectNode} />
      ) : (
        <OwnerPanel selectedNode={selectedNode} />
      )}
    </div>
  );
}

/**
 * Side panel content for standard owner nodes.
 *
 * Props:
 * selectedNode: The resolved non-hub node to display in the panel header
 */
function OwnerPanel({ selectedNode }) {
  const nonHub = true;
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <NetworkSidePanelCardHeader selectedNode={selectedNode} nonHub={nonHub} />

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

/**
 * Side panel content for the hub owner node.
 *
 * Props:
 * - selectedNode: The hub node, including shared-facility metadata
 * - onSelectNode: Selects a related owner from the hub relationship list
 */
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

// Shared facility items are rendered in the hub panel relationship list.
const sharedFacilityShape = PropTypes.shape({
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ownerName: PropTypes.string,
  count: PropTypes.number,
  cms_ownership_type: PropTypes.string,
});

// Shared node shape used by the side panel and its child panel variants.
const selectedNodeShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    cms_ownership_type: PropTypes.string,
    star_rating: PropTypes.number,
    total_facilities: PropTypes.number,
    sharedFacilities: PropTypes.arrayOf(sharedFacilityShape),
  }),
});

OwnerNetworkSidePanel.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.arrayOf(selectedNodeShape),
  }),
  selectedNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClear: PropTypes.func,
  onSelectNode: PropTypes.func,
};

OwnerPanel.propTypes = {
  selectedNode: selectedNodeShape.isRequired,
};

HubPanel.propTypes = {
  selectedNode: selectedNodeShape.isRequired,
  onSelectNode: PropTypes.func,
};
