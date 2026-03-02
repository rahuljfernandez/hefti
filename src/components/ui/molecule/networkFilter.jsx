import React from 'react';
import NetworkSidePanelSection from './networkSidePanelAccordian';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

/**
 * Overlay filter panel for the network graph modal.
 *
 * This component groups graph controls that should appear above the graph canvas
 * instead of inside the top navigation or right-side details panel.
 *
 * Props:
 * -depth: tracks current depth of requested network (1 or 2)
 * -onSetDepth: used by buttons click to register a new selection in depth
 * -onSetSizeMetric:used by buttons in Node Size section to register new node size mode.
 * -sizeMetric: Tracks current node size viewing mode (default, star rating, quality,    financial) 3/2/26 the last two are hypothetical at this time
 *
 * Notes:
 * - Rendered by `OwnerNetworkGraphModal`
 * - Positioned by the parent container with absolute layout
 * - Reuses `NetworkSidePanelSection` to stay visually consistent with the side panel
 */
export default function NetworkFilter({
  onSetDepth,
  depth,
  onSetSizeMetric,
  sizeMetric,
}) {
  return (
    <div className="w-[410px]">
      <NetworkSidePanelSection title={'Graph Filters'} defaultOpen>
        <div className="bg-core-white border-border-primary space-y-4 border px-4 pb-4">
          {/* Network Depth */}
          <div className="space-y-2">
            <div className="text-label-sm text-core-black flex items-center gap-2">
              <span className="mt-4">Network Depth</span>
              <InformationCircleIcon className="mt-4 h-4 w-4 text-zinc-400" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSetDepth(1)}
                className={clsx(
                  'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 transition',
                  depth === 1 ? 'bg-zinc-200' : 'bg-zinc-100 hover:bg-zinc-50',
                )}
              >
                1
              </button>

              <button
                type="button"
                onClick={() => onSetDepth(2)}
                className={clsx(
                  'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 transition',
                  depth === 2 ? 'bg-zinc-200' : 'bg-zinc-100 hover:bg-zinc-50',
                )}
              >
                2
              </button>
            </div>
          </div>

          {/* Node Size */}
          <div className="space-y-2">
            <div className="text-label-sm text-core-black flex items-center gap-2">
              <span>Node Size</span>
              <InformationCircleIcon className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          {/* Metric buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSetSizeMetric?.('default')}
              className={clsx(
                'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 bg-zinc-100 transition',
                sizeMetric === 'default'
                  ? 'bg-zinc-200'
                  : 'bg-zinc-100 hover:bg-zinc-50',
              )}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => onSetSizeMetric?.('star')}
              className={clsx(
                'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 bg-zinc-100 transition',
                sizeMetric === 'star'
                  ? 'bg-zinc-200'
                  : 'bg-zinc-100 hover:bg-zinc-50',
              )}
            >
              Star Rating
            </button>
            <button
              type="button"
              onClick={() => onSetSizeMetric?.('quality')}
              className={clsx(
                'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 bg-zinc-100 transition',
                sizeMetric === 'quality'
                  ? 'bg-zinc-200'
                  : 'bg-zinc-100 hover:bg-zinc-50',
              )}
            >
              Quality
            </button>
            <button
              type="button"
              onClick={() => onSetSizeMetric?.('financial')}
              className={clsx(
                'text-label-xs text-core-black h-10 rounded-md border border-zinc-200 bg-zinc-100 transition',
                sizeMetric === 'financial'
                  ? 'bg-zinc-200'
                  : 'bg-zinc-100 hover:bg-zinc-50',
              )}
            >
              Financial
            </button>
          </div>
        </div>
      </NetworkSidePanelSection>
    </div>
  );
}
