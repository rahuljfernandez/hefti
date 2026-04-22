import React from 'react';
import NetworkSidePanelAccordion from './networkSidePanelAccordion';
import PropTypes from 'prop-types';
import InfoTooltip from '../atom/infoTooltip';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import NetworkFilterControl from '../atom/networkFilterControl';

/**
 * Overlay filter panel for the network graph modal.
 *
 * This component groups graph controls that should appear above the graph canvas
 * instead of inside the top navigation or right-side details panel.
 *
 * Props:
 * -depth: tracks current depth of requested network (1 or 2)
 * -onSetDepth: used by buttons click to register a new selection in depth
 * -onSetNodeSizeMetric: used by buttons in Node Size section to register a node size mode.
 * -nodeSizeMetric: Tracks current node size viewing mode.
 *
 * Notes:
 * - Rendered by `OwnerNetworkGraphModal`
 * - Positioned by the parent container with absolute layout
 * - Reuses `NetworkSidePanelAccordion` to stay visually consistent with the side panel
 */

export default function NetworkFilter({
  onSetDepth,
  depth,
  onSetNodeSizeMetric,
  nodeSizeMetric,
}) {
  return (
    <div className="lg:w-[300px] xl:w-[375px]">
      <NetworkSidePanelAccordion
        title={'Graph Filters'}
        icon={<Cog6ToothIcon className="h-5 w-5" />}
        defaultOpen
      >
        <div className="bg-core-white border-border-primary space-y-4 border px-4 pb-4">
          {/* Network Depth */}
          <div className="space-y-2">
            <div className="text-label-sm text-core-black mt-4 flex items-center gap-2">
              <span className="">Network Depth</span>
              <InfoTooltip text="Controls how many relationship layers are shown in the graph. Depth 1 shows direct connections. Depth 2 shows secondary relationships." />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NetworkFilterControl
                value={1}
                active={depth === 1}
                onClick={() => onSetDepth(1)}
              />
              <NetworkFilterControl
                value={2}
                active={depth === 2}
                onClick={() => onSetDepth(2)}
              />
            </div>
          </div>

          {/* Node Size */}
          <div className="space-y-2">
            <div className="text-label-sm text-core-black flex items-center gap-2">
              <span>Node Size</span>
              <InfoTooltip text="Determines how node size is scaled. Choose between uniform sizing or scaling by Star Rating, Operating Margin, or Related Party to Total Operating Expenses." />
            </div>
          </div>

          {/* Metric buttons */}
          <div className="grid grid-cols-2 gap-2">
            <NetworkFilterControl
              value={'Default'}
              active={nodeSizeMetric === 'default'}
              onClick={() => onSetNodeSizeMetric('default')}
            />
            <NetworkFilterControl
              value={'Star Rating'}
              active={nodeSizeMetric === 'starRating'}
              onClick={() => onSetNodeSizeMetric('starRating')}
            />
            <NetworkFilterControl
              value={'Op Margin'}
              active={nodeSizeMetric === 'operatingMargin'}
              onClick={() => onSetNodeSizeMetric('operatingMargin')}
            />
            <NetworkFilterControl
              value={'RPTOE'}
              active={nodeSizeMetric === 'relatedPartyExpenseRatio'}
              onClick={() =>
                onSetNodeSizeMetric('relatedPartyExpenseRatio')
              }
              ariaLabel="Related Party to Total Operating Expenses"
            />
          </div>
        </div>
      </NetworkSidePanelAccordion>
    </div>
  );
}

NetworkFilter.propTypes = {
  onSetDepth: PropTypes.func.isRequired,
  depth: PropTypes.oneOf([1, 2]).isRequired,
  onSetNodeSizeMetric: PropTypes.func.isRequired,
  nodeSizeMetric: PropTypes.oneOf([
    'default',
    'starRating',
    'operatingMargin',
    'relatedPartyExpenseRatio',
  ]).isRequired,
};
