import React from 'react';
import PropTypes from 'prop-types';
import OwnerNetworkGraphNav from './ownerNetworkGraphNav';
import NetworkFilter from './networkFilter';
import NetworkGraph from './networkGraph';
import OwnerNetworkSidePanel from './ownerNetworkSidePanel';
import {
  NetworkGraphSkeleton,
  NetworkSidePanelSkeleton,
} from '../atom/skeletons.jsx';

/**
 * Desktop presentation shell for the Owner Network Graph modal.
 *
 * Responsibilities:
 * - Renders top nav + floating graph filter controls
 * - Renders the Sigma graph canvas and right-side owner panel
 * - Displays loading/error states for desktop layout
 *
 * Note:
 * - This component is intentionally presentational; state lives in
 *   `OwnerNetworkGraphModal`.
 */
export default function OwnerNetworkGraphDesktopLayout({
  onClose,
  searchQuery,
  onSetSearchQuery,
  searchResults,
  isSearchOpen,
  onSetIsSearchOpen,
  onSelectSearchResult,
  status,
  error,
  data,
  onSelectNode,
  pinRequestNodeId,
  onPinRequestConsumed,
  onSearchResults,
  nodeSizeMetric,
  onSetDepth,
  depth,
  onSetNodeSizeMetric,
  selectedNodeId,
  onClearSelection,
  onSelectSidePanelNode,
}) {
  return (
    <div className="bg-core-white absolute inset-0 flex flex-col overflow-hidden shadow-xl">
      <OwnerNetworkGraphNav
        onClose={onClose}
        searchQuery={searchQuery}
        onSetSearchQuery={onSetSearchQuery}
        searchResults={searchResults}
        isSearchOpen={isSearchOpen}
        onSetIsSearchOpen={onSetIsSearchOpen}
        onSelectSearchResult={onSelectSearchResult}
      />

      <div className="relative min-h-0 flex-1">
        <div className="absolute top-0 left-0 z-20 w-48">
          <NetworkFilter
            onSetDepth={onSetDepth}
            depth={depth}
            onSetNodeSizeMetric={onSetNodeSizeMetric}
            nodeSizeMetric={nodeSizeMetric}
          />
        </div>

        {status === 'loading' && (
          <div className="flex h-full min-h-0">
            <div className="relative min-w-0 flex-1">
              <NetworkGraphSkeleton />
            </div>
            <NetworkSidePanelSkeleton />
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Unable to load graph
              </div>
              <div className="mt-1 text-sm text-gray-600">{error}</div>
            </div>
          </div>
        )}

        {status === 'ready' && data && (
          <div className="flex h-full min-h-0">
            <div className="min-w-0 flex-1">
              <NetworkGraph
                data={data}
                onSelectNode={onSelectNode}
                pinRequestNodeId={pinRequestNodeId}
                onPinRequestConsumed={onPinRequestConsumed}
                searchQuery={searchQuery}
                onSearchResults={onSearchResults}
                nodeSizeMetric={nodeSizeMetric}
                isSearchOpen={isSearchOpen}
              />
            </div>

            <OwnerNetworkSidePanel
              data={data}
              selectedNodeId={selectedNodeId}
              onClear={onClearSelection}
              onSelectNode={onSelectSidePanelNode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

OwnerNetworkGraphDesktopLayout.propTypes = {
  onClose: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSetSearchQuery: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  isSearchOpen: PropTypes.bool.isRequired,
  onSetIsSearchOpen: PropTypes.func.isRequired,
  onSelectSearchResult: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['idle', 'loading', 'ready', 'error']).isRequired,
  error: PropTypes.string,
  data: PropTypes.object,
  onSelectNode: PropTypes.func.isRequired,
  pinRequestNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPinRequestConsumed: PropTypes.func.isRequired,
  onSearchResults: PropTypes.func.isRequired,
  nodeSizeMetric: PropTypes.oneOf([
    'default',
    'starRating',
    'operatingMargin',
    'relatedPartyExpenseRatio',
  ]).isRequired,
  onSetDepth: PropTypes.func.isRequired,
  depth: PropTypes.number.isRequired,
  onSetNodeSizeMetric: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClearSelection: PropTypes.func.isRequired,
  onSelectSidePanelNode: PropTypes.func.isRequired,
};
