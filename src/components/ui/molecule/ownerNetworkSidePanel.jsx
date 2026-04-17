import React, { useMemo } from 'react';
import NetworkSidePanelCardHeader from '../molecule/networkSidePanelCardHeader';
import PropTypes from 'prop-types';
import OwnerNetworkContent from './ownerNetworkContent';

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
 
 * - onSelectNode: Selects a related node from the hub panel list
 */
export default function OwnerNetworkSidePanel({
  data,
  selectedNodeId,
  onSelectNode,
  variant = 'desktop',
}) {
  const selectedNode = useMemo(() => {
    if (!data?.nodes?.length || !selectedNodeId) return null;
    return (
      data.nodes.find((n) => String(n.id) === String(selectedNodeId)) ?? null
    );
  }, [data, selectedNodeId]);

  if (!selectedNodeId || !selectedNode) return null;

  console.log(data);

  return (
    <div className="border-border-primary flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-hidden border xl:w-[375px]">
      {selectedNode.type === 'hub' ? (
        <HubPanel
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          variant={variant}
        />
      ) : (
        <OwnerPanel selectedNode={selectedNode} variant={variant} />
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
function OwnerPanel({ selectedNode, variant }) {
  const nonHub = true;
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <NetworkSidePanelCardHeader
        selectedNode={selectedNode}
        nonHub={nonHub}
        variant={variant}
      />
      <OwnerNetworkContent mode={'non-hub'} meta={selectedNode.meta} variant={variant} />
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
function HubPanel({ selectedNode, onSelectNode, variant }) {
  const shared = selectedNode?.meta?.sharedFacilities ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <NetworkSidePanelCardHeader
        selectedNode={selectedNode}
        variant={variant}
      />
      <OwnerNetworkContent
        shared={shared}
        onSelectNode={onSelectNode}
        mode={'hub'}
        meta={selectedNode.meta}
        variant={variant}
      />
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
  onSelectNode: PropTypes.func,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

OwnerPanel.propTypes = {
  selectedNode: selectedNodeShape.isRequired,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

HubPanel.propTypes = {
  selectedNode: selectedNodeShape.isRequired,
  onSelectNode: PropTypes.func,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};
