import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';
import NetworkGraph from './networkGraph';
import OwnerNetworkSearchBar from './ownerNetworkSearchBar';
import { NetworkGraphSkeleton } from '../atom/skeletons.jsx';
import NetworkErrorCard from '../atom/networkErrorCard';
import NetworkSidePanelCardHeader from './networkSidePanelCardHeader';
import OwnerNetworkContent from './ownerNetworkContent';

/**
 * Mobile presentation shell for the Owner Network Graph modal.
 *
 * Responsibilities:
 * - Renders the graph canvas under a draggable bottom sheet
 * - Hosts mobile search UI and selected-owner summary inside the sheet
 * - Renders hub/non-hub owner content sections in the sheet body
 * - Displays loading/error states for mobile layout
 *
 * Note:
 * - Drag/snap state is controlled by `OwnerNetworkGraphModal`; this component
 *   only receives values + handlers via props.
 */
export default function OwnerNetworkGraphMobileLayout({
  status,
  data,
  onSelectNode,
  pinRequestNodeId,
  onPinRequestConsumed,
  searchQuery,
  onSearchResults,
  nodeSizeMetric,
  isSearchOpen,
  onSetSearchQuery,
  searchResults,
  onSelectSearchResult,
  onSetIsSearchOpen,
  onSearchOpen,
  renderedSheetHeightPx,
  isDraggingSheet,
  onSheetPointerDown,
  onSheetPointerMove,
  onSheetPointerEnd,
  sheetScrollRef,
  selectedNode,
  onSelectContentNode,
  onClose,
  onRetry,
}) {
  return (
    <div className="bg-core-white absolute inset-0 flex flex-col overflow-hidden shadow-xl">
      <div className="relative min-h-0 flex-1">
        {status === 'loading' && <NetworkGraphSkeleton />}

        {status === 'error' && (
          <>
            <div className="pointer-events-none absolute inset-0 select-none opacity-60">
              <NetworkGraphSkeleton error />
            </div>
            <div className="absolute inset-0 z-10 grid place-items-center px-6">
              <NetworkErrorCard onRetry={onRetry} />
            </div>
          </>
        )}

        {status === 'ready' && data && (
          <div className="h-full min-h-0">
            <NetworkGraph
              data={data}
              onSelectNode={onSelectNode}
              pinRequestNodeId={pinRequestNodeId}
              onPinRequestConsumed={onPinRequestConsumed}
              searchQuery={searchQuery}
              onSearchResults={onSearchResults}
              nodeSizeMetric={nodeSizeMetric}
              isSearchOpen={isSearchOpen}
              showFullScreenControl={false}
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-30">
          <div
            className={clsx(
              'border-border-primary flex flex-col rounded-t-2xl border-t bg-zinc-900 shadow-xl',
              'overflow-hidden transition-[height] duration-300 ease-out',
              isDraggingSheet && 'transition-none',
            )}
            style={{ height: `${renderedSheetHeightPx}px` }}
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerEnd}
            onPointerCancel={onSheetPointerEnd}
          >
            <div className="relative flex shrink-0 touch-none justify-center py-4">
              <div className="bg-content-inverse-primary h-1 w-10 rounded-full" />
              <button
                onClick={onClose}
                aria-label="Close network graph"
                className="text-content-tertiary hover:text-core-white absolute top-2 right-4"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            <div
              ref={sheetScrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-4"
            >
              <div className="px-3 pb-2">
                <OwnerNetworkSearchBar
                  variant="mobile"
                  searchQuery={searchQuery}
                  onSetSearchQuery={onSetSearchQuery}
                  searchResults={searchResults}
                  onSelectSearchResult={onSelectSearchResult}
                  isSearchOpen={isSearchOpen}
                  onSetIsSearchOpen={(open) => {
                    onSetIsSearchOpen(open);
                    if (open) onSearchOpen();
                  }}
                />
              </div>

              {selectedNode && (
                <NetworkSidePanelCardHeader
                  variant="mobile"
                  selectedNode={selectedNode}
                  nonHub={selectedNode.type !== 'hub'}
                />
              )}

              {selectedNode && (
                <OwnerNetworkContent
                  mode={selectedNode.type === 'hub' ? 'hub' : 'non-hub'}
                  shared={selectedNode?.meta?.sharedFacilities ?? []}
                  meta={selectedNode.meta}
                  onSelectNode={onSelectContentNode}
                  variant="mobile"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

OwnerNetworkGraphMobileLayout.propTypes = {
  status: PropTypes.oneOf(['idle', 'loading', 'ready', 'error']).isRequired,
  data: PropTypes.object,
  onSelectNode: PropTypes.func.isRequired,
  pinRequestNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPinRequestConsumed: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchResults: PropTypes.func.isRequired,
  nodeSizeMetric: PropTypes.oneOf([
    'default',
    'starRating',
    'operatingMargin',
    'relatedPartyExpenseRatio',
  ]).isRequired,
  isSearchOpen: PropTypes.bool.isRequired,
  onSetSearchQuery: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  onSelectSearchResult: PropTypes.func.isRequired,
  onSetIsSearchOpen: PropTypes.func.isRequired,
  onSearchOpen: PropTypes.func.isRequired,
  renderedSheetHeightPx: PropTypes.number.isRequired,
  isDraggingSheet: PropTypes.bool.isRequired,
  onSheetPointerDown: PropTypes.func.isRequired,
  onSheetPointerMove: PropTypes.func.isRequired,
  onSheetPointerEnd: PropTypes.func.isRequired,
  sheetScrollRef: PropTypes.shape({ current: PropTypes.any }),
  selectedNode: PropTypes.object,
  onSelectContentNode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};
