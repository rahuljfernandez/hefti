import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NetworkGraph from './networkGraph';
import OwnerNetworkSidePanel from './OwnerNetworkSidePanel';
import OwnerNetworkGraphNav from './ownerNetworkGraphNav';
import NetworkFilter from './networkFilter';
import clsx from 'clsx';

/**
 * Full-screen modal for viewing an owner's relationship network.
 *
 * Responsibilities:
 * - Fetches network data for the selected owner and depth
 * - Coordinates graph selection, pin requests, and search state
 * - Acts as main hub for state in the Network Graph feature.
 * - Opens the side panel on the hub owner by default without pinning the graph node
 *
 * Composition:
 * - `OwnerNetworkGraphNav` for search and top-level controls
 * - `NetworkGraph` for Sigma rendering and interaction
 * - `OwnerNetworkSidePanel` for hub/owner details
 * - `NetworkFilter` as a floating graph overlay
 * 
 *  * Note:
 * - `selectedNodeId` tracks explicit user selection, while `defaultNodeId` keeps the hub panel open on initial load.

 */

export default function OwnerNetworkGraphModal({ isOpen, onClose, ownerId }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://hefti-data-api.ddev.site:3000/api';

  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null); // Explicit user-selected node
  const [depth, setDepth] = useState(2); // Network depth sent to the API
  const [sizeMetric, setSizeMetric] = useState('default'); // Controls node sizing mode
  const [searchQuery, setSearchQuery] = useState(''); // Current search input value
  const [searchResults, setSearchResults] = useState([]); // Search matches from the graph index
  const [pinRequestNodeId, setPinRequestNodeId] = useState(null); // Requests a graph node to pin/focus
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Controls search dropdown visibility
  const [defaultNodeId, setDefaultNodeId] = useState(null); // Hub node shown by default in the side panel

  // Build the API endpoint for the current owner and selected network depth.
  const endpoint = useMemo(() => {
    return `${API_BASE_URL}/owners/id/${ownerId}/network?depth=${depth}`;
  }, [API_BASE_URL, ownerId, depth]);

  useEffect(() => {
    if (!isOpen) return;
    if (!ownerId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const json = await res.json();

        setData(json);
        setStatus('ready');
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err?.message || 'Unknown error');
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [isOpen, endpoint, ownerId]);

  // When graph data is ready, default the side panel to the hub owner
  // without pinning the hub node in Sigma.
  useEffect(() => {
    if (!isOpen) return;
    if (status !== 'ready') return;
    if (!data?.hubId) return;

    setDefaultNodeId(data.hubId);
  }, [isOpen, status, data?.hubId]);

  // Side panel shows the explicit selection first, otherwise the default hub node.
  const effectiveSelectedNodeId = selectedNodeId ?? defaultNodeId;

  // Reset graph UI state when the modal opens or the network scope changes.
  useEffect(() => {
    if (!isOpen) return;
    setSelectedNodeId(null);
    setDefaultNodeId(null);
    setPinRequestNodeId(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [isOpen, ownerId, depth]);

  // Close the modal on Escape while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build shared-facility search metadata from the hub node.
  const hubNode = data?.nodes?.find((node) => node.id === data.hubId);

  const sharedFaciltyResults =
    hubNode?.meta?.sharedFacilities.map((shared) => ({
      id: shared.ownerId,
      label: shared.ownerName,
      meta: { count: shared.count, kind: 'sharedFacility' },
    })) ?? [];

  return (
    <div className="fixed inset-0 z-100">
      {/* Panel */}
      <div className="bg-core-white absolute inset-0 flex flex-col overflow-hidden shadow-xl">
        {/* Top Bar/ Basic Nav Bar */}
        <OwnerNetworkGraphNav
          onClose={onClose}
          searchQuery={searchQuery}
          onSetSearchQuery={setSearchQuery}
          searchResults={searchResults}
          isSearchOpen={isSearchOpen}
          onSetIsSearchOpen={setIsSearchOpen}
          onSelectSearchResult={(node) => {
            setSelectedNodeId(node.id);
            setPinRequestNodeId(node.id);
            setIsSearchOpen(false);
            setSearchResults([]);
          }}
        />
        {/* Body */}
        <div className="relative min-h-0 flex-1">
          <div className="absolute top-0 left-0 z-20 w-48">
            {/* Floating controls for graph-specific filters */}
            <NetworkFilter
              onSetDepth={setDepth}
              depth={depth}
              onSetSizeMetric={setSizeMetric}
              sizeMetric={sizeMetric}
            />
          </div>

          {status === 'loading' && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-sm text-gray-600">Loading graph...</div>
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
          {/* Network Graph */}
          {status === 'ready' && data && (
            <div className="flex h-full min-h-0">
              <div className="min-w-0 flex-1">
                <NetworkGraph
                  data={data}
                  onSelectNode={setSelectedNodeId}
                  pinRequestNodeId={pinRequestNodeId}
                  onPinRequestConsumed={() => setPinRequestNodeId(null)}
                  searchQuery={searchQuery}
                  onSearchResults={setSearchResults}
                  sizeMetric={sizeMetric}
                  isSearchOpen={isSearchOpen}
                />
              </div>
              {/* Side Panel */}
              <OwnerNetworkSidePanel
                data={data}
                selectedNodeId={effectiveSelectedNodeId}
                onClear={() => {
                  setSelectedNodeId(null);
                  setPinRequestNodeId(null);
                }}
                onSelectNode={(nodeId) => {
                  setSelectedNodeId(nodeId);
                  setPinRequestNodeId(nodeId);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

OwnerNetworkGraphModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
