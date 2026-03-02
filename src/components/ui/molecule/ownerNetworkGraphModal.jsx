import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NetworkGraph from './networkGraph';
import OwnerNetworkSidePanel from './OwnerNetworkSidePanel';
import OwnerNetworkGraphNav from './ownerNetworkGraphNav';
import NetworkFilter from './networkFilter';
import clsx from 'clsx';

export default function OwnerNetworkGraphModal({ isOpen, onClose, ownerId }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://hefti-data-api.ddev.site:3000/api';

  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);
  //Setter is passed into sigma network graph functional layer to facilitate the selecting of node id.  node id is passed into the side panel.
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [depth, setDepth] = useState(2); // default depth set to 2
  const [sizeMetric, setSizeMetric] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // [{ id, label }]
  const [pinRequestNodeId, setPinRequestNodeId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [defaultNodeId, setDefaultNodeId] = useState(null);

  //api call to grab owner network for graph
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

  //When data loads, set the default node to hub.
  // This allows us to open the sidebar with the hub owner's info but not have it pinned.
  // SetNodeId is linked to pinning.
  // Keeping those seperate.
  useEffect(() => {
    if (!isOpen) return;
    if (status !== 'ready') return;
    if (!data?.hubId) return;

    setDefaultNodeId(data.hubId);
  }, [isOpen, status, data?.hubId]);

  //This is passed as a prop to OwnerNetworkSidePanel.
  //There either the hub onwer or the node the user selects will be rendered.
  const effectiveSelectedNodeId = selectedNodeId ?? defaultNodeId;

  //Clear selection when opening or changing owner/depth
  useEffect(() => {
    if (!isOpen) return;
    setSelectedNodeId(null);
    setDefaultNodeId(null);
    setPinRequestNodeId(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [isOpen, ownerId, depth]);

  //When modal is open enbable use of keyboard espape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  //Here we are grabbing the weighted shared facilities to use in the search
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
        {/* Header */}
        <OwnerNetworkGraphNav
          onSetDepth={setDepth}
          depth={depth}
          onClose={onClose}
          sizeMetric={sizeMetric}
          onSetSizeMetric={setSizeMetric}
          searchQuery={searchQuery}
          onSetSearchQuery={setSearchQuery}
          searchResults={searchResults}
          sharedFaciltyResults={sharedFaciltyResults}
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
            {/**Tools to interact with graph */}
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
                  Couldn't load graph
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
                  onSelectNode={setSelectedNodeId}
                  pinRequestNodeId={pinRequestNodeId}
                  onPinRequestConsumed={() => setPinRequestNodeId(null)}
                  searchQuery={searchQuery}
                  onSearchResults={setSearchResults}
                  sizeMetric={sizeMetric}
                  isSearchOpen={isSearchOpen}
                />
              </div>

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
