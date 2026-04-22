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

/**
 * Owner network graph view built on Sigma and graphology.
 *
 * Responsibilities:
 * - Converts API network data into a Sigma-compatible graph
 * - Runs layout and graph interaction behavior for hover, click, and pinning
 * - Filters visible neighborhoods based on the active node
 * - Builds the search index that powers the modal search dropdown
 */

const sigmaStyle = { height: '100%', width: '100%' };

const sharedFacilityShape = PropTypes.shape({
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
});

const nodeShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    cms_ownership_type: PropTypes.string,
    star_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cms_owner_avg_operating_margin: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    cms_owner_avg_related_to_total_exp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    sharedFacilities: PropTypes.arrayOf(sharedFacilityShape),
  }),
});

const linkShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  relType: PropTypes.string,
});

const graphDataShape = PropTypes.shape({
  hubId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodes: PropTypes.arrayOf(nodeShape),
  links: PropTypes.arrayOf(linkShape),
});

/**
 * Converts the fetched network payload into a graphology graph instance.
 *
 * Adds node display metadata, initializes coordinates for the layout worker,
 * and creates weighted edges for Sigma to render.
 */
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
        ? '#F59E0B' //set hub color
        : node?.meta?.cms_ownership_type === 'Individual'
          ? '#0F766E' //set individual color
          : '#C2410C', //set organization color
      x: 0,
      y: 0,
      nodeType: node.type,
      meta: node.meta,
      starRating: Number.isFinite(Number(node?.meta?.star_rating))
        ? Number(node.meta.star_rating)
        : null,
      operatingMargin: Number.isFinite(
        Number(node?.meta?.cms_owner_avg_operating_margin),
      )
        ? Number(node.meta.cms_owner_avg_operating_margin)
        : null,
      relatedPartyExpenseRatio: Number.isFinite(
        Number(node?.meta?.cms_owner_avg_related_to_total_exp),
      )
        ? Number(node.meta.cms_owner_avg_related_to_total_exp)
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

/**
 * Loads the current network payload into Sigma whenever the backing data changes.
 *
 * Props:
 * - data: Graph payload containing the nodes and links to render
 */
function LoadNetwork({ data }) {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (!data?.nodes?.length) return;
    loadGraph(buildGraph(data));
  }, [data, loadGraph]);

  return null;
}

LoadNetwork.propTypes = {
  data: graphDataShape,
};

/**
 * Starts the ForceAtlas2 layout worker when the graph mounts.
 *
 * Props:
 * - startOnMount: Whether the force layout should start automatically
 */
function ForceAtlasToggle({ startOnMount = true }) {
  const { start, stop } = useWorkerLayoutForceAtlas2({
    settings: { slowDown: 10, gravity: 1, scalingRatio: 2 },
  });

  useEffect(() => {
    if (!startOnMount) return;
    start();
    return () => stop();
  }, [startOnMount, start, stop]);

  return null;
}

ForceAtlasToggle.propTypes = {
  startOnMount: PropTypes.bool,
};

/**
 * Wires Sigma interactions for hover, click, and externally requested pinning.
 *
 * Responsibilities:
 * - Tracks hovered and locked nodes
 * - Notifies the parent when the pinned node changes
 * - Applies reducers so the active node neighborhood stays visible
 * - Handles search-driven pin requests from outside the graph
 *
 * Props:
 * - onPinnedChang: Called when the locked node selection changes
 * - pinRequestNodeId: Node id requested externally for pin/focus behavior
 * - onPinRequestConsumed: Clears the external pin request after it is handled
 * - nodeSizeMetric: Controls which metric drives node sizing
 */
function InteractionLayer({
  onPinnedChange,
  pinRequestNodeId,
  onPinRequestConsumed,
  nodeSizeMetric,
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

  //calculating star rating to size
  const starRatingToSize = useCallback((star) => {
    // fallback for unknown ratings
    if (star == null || Number.isNaN(star)) return 7;

    const s = Math.max(1, Math.min(5, star)); // 1..5
    const t = (s - 1) / 4; // 0..1

    const min = 5;
    const max = 20;

    const gamma = 2.2; // higher = more dramatic
    return min + Math.pow(t, gamma) * (max - min);
  }, []);

  // operating margin: percentage scale, ≤0 = min, cap at 25%
  const operatingMarginToSize = useCallback((margin) => {
    if (margin == null || Number.isNaN(margin)) return 5;
    if (margin <= 0) return 5;
    const t = Math.min(1, margin / 25);
    return 5 + t * 15;
  }, []);

  // RPTOE: percentage scale, cap at 50%
  const relatedPartyExpenseRatioToSize = useCallback((ratio) => {
    if (ratio == null || Number.isNaN(ratio)) return 5;
    const t = Math.min(1, Math.max(0, ratio / 50));
    return 5 + t * 15;
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

  // When search selects a node, request comes in here
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
  }, [registerEvents, sigma, lockedNode, pinNode]);

  // reducers: show only active + neighbors
  useEffect(() => {
    setSettings({
      zIndex: true,
      nodeReducer: (node, data) => {
        const res = { ...data };

        // Base size by mode
        if (nodeSizeMetric === 'starRating') {
          res.size = starRatingToSize(data.starRating);
        } else if (nodeSizeMetric === 'operatingMargin') {
          res.size = operatingMarginToSize(data.operatingMargin);
        } else if (nodeSizeMetric === 'relatedPartyExpenseRatio') {
          res.size = relatedPartyExpenseRatioToSize(
            data.relatedPartyExpenseRatio,
          );
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
  }, [
    setSettings,
    graph,
    activeNode,
    neighborSet,
    starRatingToSize,
    operatingMarginToSize,
    relatedPartyExpenseRatioToSize,
    nodeSizeMetric,
  ]);

  return null;
}

InteractionLayer.propTypes = {
  onPinnedChange: PropTypes.func,
  pinRequestNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPinRequestConsumed: PropTypes.func,
  nodeSizeMetric: PropTypes.oneOf([
    'default',
    'starRating',
    'operatingMargin',
    'relatedPartyExpenseRatio',
  ]),
};

/**
 * Builds and filters the graph search index used by the modal nav dropdown.
 *
 * Reads labels and shared-facility counts from the Sigma graph, then returns
 * ranked results to the parent as the user focuses or types in the search box.
 *
 * Props:
 * - searchQuery: Current raw text from the graph search input
 * - onSearchResults: Sends the latest ranked result list to the parent
 * - isSearchOpen: Whether the search dropdown is currently active
 */
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
    if (!isSearchOpen) return;

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

GraphSearchController.propTypes = {
  searchQuery: PropTypes.string,
  onSearchResults: PropTypes.func,
  isSearchOpen: PropTypes.bool,
};

/**
 * Top-level Sigma graph component used inside the owner network modal.
 *
 * Composes graph loading, layout, interaction logic, and search indexing into
 * a single graph surface.
 *
 * Props:
 * - data: Network payload returned by the owner network endpoint
 * - onSelectNode: Updates the selected node when a graph node is pinned
 * - searchQuery: Current search input value from the modal nav
 * - onSearchResults: Receives search suggestions generated from graph data
 * - pinRequestNodeId: External node id to pin from search or panel actions
 * - onPinRequestConsumed: Clears the pin request after it has been handled
 * - nodeSizeMetric: Controls the node sizing mode
 * - isSearchOpen: Whether the search dropdown is open
 */
export default function NetworkGraph({
  data,
  onSelectNode,
  searchQuery,
  onSearchResults,
  pinRequestNodeId,
  onPinRequestConsumed,
  nodeSizeMetric,
  isSearchOpen,
  showFullScreenControl = true,
}) {
  //fallback for setting node size mode
  const effectiveNodeSizeMetric = nodeSizeMetric ?? 'default';
  //if you need to set the background color of the graph it is done in tailwind.css
  return (
    <SigmaContainer
      style={sigmaStyle}
      settings={{
        autoRescale: false,
      }}
    >
      <LoadNetwork data={data} />
      <ForceAtlasToggle startOnMount />
      <InteractionLayer
        onPinnedChange={onSelectNode}
        pinRequestNodeId={pinRequestNodeId}
        onPinRequestConsumed={onPinRequestConsumed}
        nodeSizeMetric={effectiveNodeSizeMetric}
      />
      <GraphSearchController
        searchQuery={searchQuery}
        onSearchResults={onSearchResults}
        isSearchOpen={isSearchOpen}
      />
      <ControlsContainer position="top-right">
        <ZoomControl />
        {showFullScreenControl && <FullScreenControl />}
      </ControlsContainer>
    </SigmaContainer>
  );
}

NetworkGraph.propTypes = {
  data: graphDataShape,
  onSelectNode: PropTypes.func,
  searchQuery: PropTypes.string,
  onSearchResults: PropTypes.func,
  pinRequestNodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPinRequestConsumed: PropTypes.func,
  nodeSizeMetric: PropTypes.oneOf([
    'default',
    'starRating',
    'operatingMargin',
    'relatedPartyExpenseRatio',
  ]),
  isSearchOpen: PropTypes.bool,
  showFullScreenControl: PropTypes.bool,
};
