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
}

function InteractionLayer({ onPinnedChange }) {
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
        setLockedNode((prev) => (prev === e.node ? null : e.node));
        setHoveredNode(null);
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
          if (isActive) res.size = (data.size ?? 8) + 2;
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
  }, [setSettings, graph, activeNode, neighborSet]);

  return null;
}

export default function NetworkGraph({ data, onSelectNode }) {
  return (
    <SigmaContainer style={sigmaStyle}>
      <LoadNetwork data={data} />
      <ForceAtlasToggle startOnMount />
      <InteractionLayer onPinnedChange={onSelectNode} />

      <ControlsContainer position="bottom-right">
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}
