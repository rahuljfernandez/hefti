import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Graph from 'graphology';
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from '@react-sigma/core';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';
import '@react-sigma/core/lib/style.css';
import {
  ControlsContainer,
  FullScreenControl,
  ZoomControl,
} from '@react-sigma/core';

const sigmaStyle = { height: '100%', width: '100%' };

function buildGraph(data) {
  const graph = new Graph({ type: 'undirected', multi: false });

  const hubId = data?.hubId ?? null;
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const links = Array.isArray(data?.links) ? data.links : [];

  for (const node of nodes) {
    if (!node?.id) continue;
    if (graph.hasNode(node.id)) continue;

    const isHub = hubId && node.id === hubId;

    graph.addNode(node.id, {
      label: node.label || node.id,
      size: isHub ? 14 : 8,
      color: isHub
        ? '#F59E0B'
        : node?.meta?.cms_ownership_type === 'Individual'
          ? '#0F766E'
          : '#C2410C',
      x: 0,
      y: 0,
      nodeType: node.type,
      meta: node.meta,
      starRating: Number.isFinite(Number(node?.meta.star_rating))
        ? Number(node.meta.star_rating)
        : null,
    });
  }

  // simple initial circle so FA2 has a starting point
  const ids = graph.nodes();
  const R = 10;
  ids.forEach((id, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, ids.length);
    graph.setNodeAttribute(id, 'x', Math.cos(a) * R);
    graph.setNodeAttribute(id, 'y', Math.sin(a) * R);
  });

  for (const l of links) {
    if (!l?.source || !l?.target) continue;
    if (!graph.hasNode(l.source) || !graph.hasNode(l.target)) continue;
    if (l.source === l.target) continue;

    const key = l.id || `${l.source}__${l.target}`;
    if (graph.hasEdge(key)) continue;

    const w = Number(l.weight ?? 1);

    graph.addEdgeWithKey(key, l.source, l.target, {
      label: l.relType ? `${l.relType} (${w})` : String(w),
      size: Math.max(1, Math.log1p(w)),
      weight: w,
      color: 'rgba(160,160,160,0.8)',
      relType: l.relType,
    });
  }

  return graph;
}

function LoadNetwork({ data }) {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (!data?.nodes?.length) return;
    loadGraph(buildGraph(data));
  }, [data, loadGraph]);

  return null;
}

function ForceAtlasToggle({ startOnMount = true }) {
  const { start, stop, isRunning } = useWorkerLayoutForceAtlas2({
    settings: { slowDown: 10, gravity: 1, scalingRatio: 2 },
  });

  useEffect(() => {
    if (!startOnMount) return;
    start();
    return () => stop();
  }, [startOnMount, start, stop]);

  return null;
}

function InteractionLayer({
  onPinnedChange,
  pinRequestNodeId,
  onPinRequestConsumed,
  sizeMetric,
}) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();

  const [hoveredNode, setHoveredNode] = useState(null);
  const [lockedNode, setLockedNode] = useState(null);

  const activeNode = lockedNode || hoveredNode;

  const neighborSet = useMemo(() => {
    if (!activeNode) return null;
    return new Set(graph.neighbors(activeNode));
  }, [graph, activeNode]);

  useEffect(() => {
    onPinnedChange?.(lockedNode);
  }, [lockedNode, onPinnedChange]);

  //calculating star ratingto size
  const starToSize = useCallback((star) => {
    // fallback for unknown ratings
    if (star == null || Number.isNaN(star)) return 7;

    // const clamped = Math.max(1, Math.min(5, star));
    // return 6 + ((clamped - 1) / 4) * 8;

    const s = Math.max(1, Math.min(5, star)); // 1..5
    const t = (s - 1) / 4; // 0..1

    const min = 5;
    const max = 20;

    const gamma = 2.2; // higher = more dramatic
    return min + Math.pow(t, gamma) * (max - min);
  }, []);

  //Shared pin function used by click + search
  const pinNode = useCallback(
    (nodeId) => {
      if (!nodeId) return;

      // If graph changed (depth switch) and node is gone, just ignore
      if (!graph.hasNode(nodeId)) return;

      setLockedNode((prev) => (prev === nodeId ? null : nodeId));
      setHoveredNode(null);

      // // camera focus to make it feel like a real click outcome
      //focus camera is causing bugs, come back to this idea later.
    },
    [graph],
  );

  // ✅ When search selects a node, request comes in here
  useEffect(() => {
    if (!pinRequestNodeId) return;

    pinNode(pinRequestNodeId);
    onPinRequestConsumed?.();
  }, [pinRequestNodeId, pinNode, onPinRequestConsumed]);

  // events: hover + click pin/unpin
  useEffect(() => {
    const container = sigma.getContainer();

    registerEvents({
      enterNode: (e) => {
        if (container) container.style.cursor = 'pointer';
        if (!lockedNode) setHoveredNode(e.node);
      },
      leaveNode: () => {
        if (container) container.style.cursor = 'default';
        if (!lockedNode) setHoveredNode(null);
      },
      clickNode: (e) => {
        pinNode(e.node);
        console.log('node', e.node);
      },
      clickStage: () => {
        setLockedNode(null);
        setHoveredNode(null);
        if (container) container.style.cursor = 'default';
      },
    });

    return () => {
      if (container) container.style.cursor = 'default';
    };
  }, [registerEvents, sigma, lockedNode]);

  // reducers: show only active + neighbors
  useEffect(() => {
    setSettings({
      zIndex: true,
      nodeReducer: (node, data) => {
        const res = { ...data };

        // Base size by mode
        if (sizeMetric === 'star') {
          res.size = starToSize(data.starRating);
        } else {
          // keep what buildGraph set
          res.size = data.size ?? 8;
        }

        if (!activeNode) {
          res.hidden = false;
          res.label = data.label ?? node;
          return res;
        }

        const isActive = node === activeNode;
        const isNeighbor = neighborSet?.has(node);

        if (isActive || isNeighbor) {
          res.hidden = false;
          res.label = data.label ?? node;

          if (isActive)
            res.size = Math.max(res.size ?? 0, data.size ?? 8) * 1.15;
          return res;
        }

        res.hidden = true;
        res.label = '';
        return res;
      },

      edgeReducer: (edge, data) => {
        const res = { ...data };

        if (!activeNode) {
          res.hidden = false;
          return res;
        }

        const source = graph.source(edge);
        const target = graph.target(edge);
        res.hidden = !(source === activeNode || target === activeNode);
        return res;
      },
    });
  }, [setSettings, graph, activeNode, neighborSet, starToSize, sizeMetric]);

  return null;
}

function GraphSearchController({ searchQuery, onSearchResults, isSearchOpen }) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const [index, setIndex] = useState([]);

  function normalize(s) {
    return (s || '').toString().trim().toLowerCase();
  }

  // simple scoring: startsWith > includes
  function score(labelNorm, q) {
    if (!q) return 0;
    if (labelNorm.startsWith(q)) return 2;
    if (labelNorm.includes(q)) return 1;
    return 0;
  }

  useEffect(() => {
    const buildIndex = () => {
      const arr = [];

      // Find hub node
      let sharedMap = new Map();

      graph.forEachNode((id, attrs) => {
        if (attrs?.meta?.sharedFacilities) {
          attrs.meta.sharedFacilities.forEach((sf) => {
            sharedMap.set(sf.ownerId, sf.count);
          });
        }
      });

      graph.forEachNode((id, attrs) => {
        const label = attrs?.label ?? String(id);

        arr.push({
          id,
          label,
          labelNorm: normalize(label),
          count: sharedMap.get(id) ?? null,
        });
      });

      setIndex(arr);
    };

    buildIndex(); // initial build

    graph.on('nodeAdded', buildIndex);
    graph.on('nodeDropped', buildIndex);
    graph.on('edgeAdded', buildIndex);

    return () => {
      graph.off('nodeAdded', buildIndex);
      graph.off('nodeDropped', buildIndex);
      graph.off('edgeAdded', buildIndex);
    };
  }, [graph]);

  // Build dropdown suggestions as user types and send filtered count list when search input becomes active
  useEffect(() => {
    if (!isSearchOpen) return; // don't push results when dropdown is closed

    const q = normalize(searchQuery);

    // Full list when focused and empty query
    if (!q) {
      const full = [...index]
        .sort(
          (a, b) =>
            (b.count ?? -1) - (a.count ?? -1) || // count desc
            a.label.localeCompare(b.label),
        )
        .slice(0, 50) // limit results to 50
        .map(({ id, label, count }) => ({ id, label, count }));

      onSearchResults?.(full);
      return;
    }

    // Filtered list when typing:
    const matches = index
      .map((n) => ({ ...n, s: score(n.labelNorm, q) }))
      .filter((n) => n.s > 0)
      .sort(
        (a, b) =>
          b.s - a.s ||
          (b.count ?? 0) - (a.count ?? 0) ||
          a.label.localeCompare(b.label),
      )
      .slice(0, 20)
      .map(({ id, label, count }) => ({ id, label, count }));

    onSearchResults?.(matches);
  }, [searchQuery, isSearchOpen, index, onSearchResults]);

  return null;
}

export default function NetworkGraph({
  data,
  onSelectNode,
  searchQuery,
  onSearchResults,
  pinRequestNodeId,
  onPinRequestConsumed,
  sizeMetric,
  isSearchOpen,
}) {
  //fallback for setting node size mode
  const effectiveSizeMetric = sizeMetric ?? 'default';

  return (
    <SigmaContainer
      style={sigmaStyle}
      settings={{
        backgroundColor: '#fafafa',
        autoRescale: false,
      }}
    >
      <LoadNetwork data={data} />
      <ForceAtlasToggle startOnMount />
      <InteractionLayer
        onPinnedChange={onSelectNode}
        pinRequestNodeId={pinRequestNodeId}
        onPinRequestConsumed={onPinRequestConsumed}
        sizeMetric={effectiveSizeMetric}
      />
      <GraphSearchController
        searchQuery={searchQuery}
        onSearchResults={onSearchResults}
        onSelectNode={onSelectNode}
        isSearchOpen={isSearchOpen}
      />
      <ControlsContainer position="top-right">
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}
