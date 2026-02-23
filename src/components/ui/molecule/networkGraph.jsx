import React, { useEffect, useMemo, useState } from 'react';
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
  const g = new Graph({ type: 'undirected', multi: false });

  const hubId = data?.hubId ?? null;
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const links = Array.isArray(data?.links) ? data.links : [];

  for (const n of nodes) {
    if (!n?.id) continue;
    if (g.hasNode(n.id)) continue;

    const isHub = hubId && n.id === hubId;

    g.addNode(n.id, {
      label: n.label || n.id,
      size: isHub ? 14 : 8,
      color: isHub ? '#F59E0B' : n.type === 'owner' ? '#60A5FA' : '#A3A3A3',
      x: 0,
      y: 0,
      nodeType: n.type,
      meta: n.meta,
    });
  }

  const ids = g.nodes();
  const R = 10;
  ids.forEach((id, i) => {
    const a = (2 * Math.PI * i) / Math.max(1, ids.length);
    g.setNodeAttribute(id, 'x', Math.cos(a) * R);
    g.setNodeAttribute(id, 'y', Math.sin(a) * R);
  });

  for (const l of links) {
    if (!l?.source || !l?.target) continue;
    if (!g.hasNode(l.source) || !g.hasNode(l.target)) continue;
    if (l.source === l.target) continue;

    const key = l.id || `${l.source}__${l.target}`;
    if (g.hasEdge(key)) continue;

    const w = Number(l.weight ?? 1);

    g.addEdgeWithKey(key, l.source, l.target, {
      label: l.relType ? `${l.relType} (${w})` : String(w),
      size: Math.max(1, Math.log1p(w)),
      weight: w,
      color: 'rgba(160,160,160,0.8)', //color of edge line default
      relType: l.relType,
    });
  }

  return g;
}

function LoadNetwork({ data }) {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (!data?.nodes?.length) return;
    loadGraph(buildGraph(data));
  }, [data, loadGraph]);

  return null;
}

function ForceLayoutControls({ enabledByDefault = true }) {
  const { start, stop, isRunning } = useWorkerLayoutForceAtlas2({
    settings: {
      slowDown: 10,
      gravity: 1,
      scalingRatio: 2,
    },
  });

  useEffect(() => {
    if (enabledByDefault) start();
    return () => stop();
  }, [enabledByDefault, start, stop]);

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
      <button onClick={isRunning ? stop : start}>
        {isRunning ? 'Stop layout' : 'Start layout'}
      </button>
    </div>
  );
}

/**
 * Hover-focus behavior:
 * - Hovered node + neighbors = full opacity
 * - Other nodes/edges = dimmed
 * - Only hovered + neighbors keep labels
 * - Incident edges (touch hovered) are emphasized
 */
function FocusLayer({ hubId, onPinnedChange }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [lockedNode, setLockedNode] = useState(null);
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();

  // If locked, that wins. Otherwise use hovered.
  const activeNode = lockedNode || hoveredNode;

  // Grab the sigma container element so we can set cursor reliably
  const container = useMemo(() => sigma.getContainer(), [sigma]);

  // Tell parent when pinned changes (optional)
  useEffect(() => {
    onPinnedChange?.(lockedNode);
  }, [lockedNode, onPinnedChange]);

  useEffect(() => {
    const setCursor = (value) => {
      if (container) container.style.cursor = value;
    };

    const clearHoverIfLocked = () => {
      if (lockedNode) setHoveredNode(null);
    };

    registerEvents({
      enterNode: (e) => {
        setCursor('pointer'); // cursor on interactive node
        if (lockedNode) return; // hover preview disabled when pinned
        setHoveredNode(e.node);
      },
      leaveNode: () => {
        setCursor('default');
        if (lockedNode) return;
        setHoveredNode(null);
      },

      clickNode: (e) => {
        setLockedNode((prev) => (prev === e.node ? null : e.node)); // toggle pin
        setHoveredNode(null);
        setCursor('pointer');
      },

      clickStage: () => {
        setLockedNode(null);
        setHoveredNode(null);
        setCursor('default');
      },

      // optional: if user drags the canvas, keep cursor sensible
      // downStage: () => setCursor("grabbing"),
      // upStage: () => setCursor("default"),
    });

    // If locking happens while hovering, clear hover
    clearHoverIfLocked();

    // cleanup cursor if component unmounts
    return () => setCursor('default');
  }, [container, lockedNode, registerEvents]);

  useEffect(() => {
    setSettings({
      zIndex: true,

      nodeReducer: (node, data) => {
        const res = { ...data };

        if (!activeNode) {
          res.hidden = false;
          res.zIndex = node === hubId ? 1 : 0;
          return res;
        }

        const isActive = node === activeNode;
        const isNeighbor = graph.neighbors(activeNode).includes(node);

        if (isActive) {
          res.hidden = false;
          res.size = (data.size ?? 8) + 2;
          res.label = data.label ?? node;
          return res;
        }

        if (isNeighbor) {
          res.hidden = false;
          res.label = data.label ?? node;
          return res;
        }

        res.label = '';
        res.color = 'rgba(160,160,160,0.20)';
        res.hidden = true; //hides non-focused nodes that don't respond to z-index
        return res;
      },

      edgeReducer: (edge, data) => {
        const res = { ...data };

        if (!activeNode) {
          // default
          res.hidden = false;
          res.zIndex = 0;
          return res;
        }

        const source = graph.source(edge);
        const target = graph.target(edge);
        const isIncident = source === activeNode || target === activeNode;

        if (isIncident) {
          res.hidden = false;
          res.color = 'rgba(160,160,160,0.9)'; ///color of focused edge
          res.size = Math.max(1, (data.size ?? 1) * 1.4);
          res.zIndex = 1; // draw above others
        } else {
          res.hidden = true; //  removes overdraw artifacts
          res.zIndex = 0;
        }

        return res;
      },
    });
  }, [graph, activeNode, setSettings, hubId]);

  return null;
}

// function SigmaLabelSettings() {
//   const setSettings = useSetSettings();

//   useEffect(() => {
//     setSettings({
//       renderLabels: true,

//       // Key ones:
//       labelRenderedSizeThreshold: 0, // show labels even for small nodes
//       labelDensity: 2, // higher = more labels allowed
//       labelGridCellSize: 50, // smaller cells = more labels can appear

//       // Optional polish:
//       labelFont:
//         'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
//       labelSize: 14,
//       labelWeight: 500,
//     });
//   }, [setSettings]);

//   return null;
// }

export default function NetworkGraph({ data }) {
  const [pinned, setPinned] = useState(null);
  return (
    <SigmaContainer style={sigmaStyle}>
      {/* <SigmaLabelSettings /> */}
      <LoadNetwork data={data} />
      <FocusLayer hubId={data?.hubId} onPinnedChange={setPinned} />
      <ForceLayoutControls enabledByDefault />
      <ControlsContainer position={'bottom-right'}>
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}
