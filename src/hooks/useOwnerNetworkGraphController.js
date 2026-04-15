import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Central controller for owner-network graph data + UI state.
 *
 * Owns:
 * - data fetch lifecycle (idle/loading/ready/error)
 * - selection + pin request coordination
 * - search query / search results state
 * - graph filter controls (depth, size metric)
 */
export default function useOwnerNetworkGraphController({ isOpen, ownerId }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://hefti-data-api.ddev.site:3000/api';

  // Remote graph data lifecycle.
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);

  // Shared graph UI state.
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [depth, setDepth] = useState(2);
  const [sizeMetric, setSizeMetric] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pinRequestNodeId, setPinRequestNodeId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [defaultNodeId, setDefaultNodeId] = useState(null);

  // Endpoint changes whenever the owner scope or depth filter changes.
  const endpoint = useMemo(() => {
    return `${API_BASE_URL}/owners/id/${ownerId}/network?depth=${depth}`;
  }, [API_BASE_URL, ownerId, depth]);

  // Fetch graph payload for current owner/depth while modal is open.
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

  // On successful graph load, default selection to the hub owner.
  useEffect(() => {
    if (!isOpen) return;
    if (status !== 'ready') return;
    if (!data?.hubId) return;

    setDefaultNodeId(data.hubId);
  }, [isOpen, status, data?.hubId]);

  const effectiveSelectedNodeId = selectedNodeId ?? defaultNodeId;
  const effectiveSelectedNode =
    data?.nodes?.find(
      (n) => String(n.id) === String(effectiveSelectedNodeId),
    ) ?? null;

  // Select from search and request the graph to pin/focus the node.
  const handleSelectSearchResult = useCallback((node) => {
    setSelectedNodeId(node.id);
    setPinRequestNodeId(node.id);
    setIsSearchOpen(false);
    setSearchResults([]);
  }, []);

  // Shared node-selection handler used by side panel and mobile content.
  const handleSelectNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setPinRequestNodeId(nodeId);
  }, []);

  // Clear explicit node selection + pending pin request.
  const handleClearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setPinRequestNodeId(null);
  }, []);

  // Called by graph after a pin request has been consumed.
  const handlePinRequestConsumed = useCallback(() => {
    setPinRequestNodeId(null);
  }, []);

  // Reset graph UI when modal context changes.
  useEffect(() => {
    if (!isOpen) return;
    setSelectedNodeId(null);
    setDefaultNodeId(null);
    setPinRequestNodeId(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [isOpen, ownerId, depth]);

  return {
    data,
    status,
    error,
    depth,
    sizeMetric,
    searchQuery,
    searchResults,
    pinRequestNodeId,
    isSearchOpen,
    effectiveSelectedNodeId,
    effectiveSelectedNode,
    setDepth,
    setSizeMetric,
    setSearchQuery,
    setSearchResults,
    setSelectedNodeId,
    setIsSearchOpen,
    handleSelectSearchResult,
    handleSelectNode,
    handleClearSelection,
    handlePinRequestConsumed,
  };
}
