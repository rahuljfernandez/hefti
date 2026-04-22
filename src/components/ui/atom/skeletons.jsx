import React from 'react';

function SkeletonBar({ className = '' }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function BrowseListSkeleton({ count = 10 }) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="bg-core-white border-border-primary mb-3 overflow-hidden rounded-xl border px-4 py-4 shadow-sm sm:px-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <SkeletonBar className="h-5 w-3/4" />
              <SkeletonBar className="h-4 w-1/2" />
              <SkeletonBar className="h-4 w-2/5" />
            </div>
            <div className="space-y-2">
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-3/4" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="animate-pulse font-sans">
      {/* ProfileHeader */}
      <div className="my-6 flex flex-wrap justify-between">
        <div>
          <SkeletonBar className="h-9 w-80" />
          <div className="mt-4">
            <SkeletonBar className="h-6 w-32 rounded-full" />
          </div>
          <SkeletonBar className="mt-4 h-4 w-48" />
        </div>
        <SkeletonBar className="h-10 w-36 rounded-lg" />
      </div>
      {/* Tab nav */}
      <div className="mt-6 flex gap-4 border-b border-gray-200 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} className="h-5 w-28" />
        ))}
      </div>
      {/* Tab content area */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <SkeletonBar className="h-4 w-1/2" />
              <SkeletonBar className="h-8 w-1/3" />
              <SkeletonBar className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <SkeletonBar className="h-4 w-1/4" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

// Nodes and edges for the animated graph placeholder. Positions are expressed
// as percentages of the SVG viewBox (0 0 400 300) so it scales to any canvas.
const GRAPH_NODES = [
  { id: 'hub', cx: 200, cy: 150, r: 14 },
  { id: 'a',   cx: 310, cy:  80, r:  8 },
  { id: 'b',   cx: 340, cy: 175, r:  8 },
  { id: 'c',   cx: 270, cy: 255, r:  8 },
  { id: 'd',   cx: 130, cy: 255, r:  8 },
  { id: 'e',   cx:  90, cy: 165, r:  8 },
  { id: 'f',   cx: 140, cy:  75, r:  8 },
  { id: 'g',   cx: 310, cy: 220, r:  6 },
  { id: 'h',   cx:  95, cy: 100, r:  6 },
];

const GRAPH_EDGES = [
  ['hub', 'a'], ['hub', 'b'], ['hub', 'c'],
  ['hub', 'd'], ['hub', 'e'], ['hub', 'f'],
  ['b',   'g'], ['e',   'h'], ['a',   'f'],
];

function nodePos(id) {
  return GRAPH_NODES.find((n) => n.id === id);
}

function GraphSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true">
      <style>{`
        @keyframes graphPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.9; }
        }
        .gp-edge     { animation: graphPulse 2s ease-in-out infinite; }
        .gp-node     { animation: graphPulse 2s ease-in-out infinite; }
        .gp-node-hub { animation: graphPulse 1.6s ease-in-out infinite; }
      `}</style>
      {GRAPH_EDGES.map(([from, to]) => {
        const s = nodePos(from);
        const t = nodePos(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={s.cx} y1={s.cy} x2={t.cx} y2={t.cy}
            stroke="#D1D5DB" strokeWidth="1.5" className="gp-edge"
            style={{ animationDelay: `${Math.random() * 0.8}s` }}
          />
        );
      })}
      {GRAPH_NODES.map((n) => (
        <circle
          key={n.id} cx={n.cx} cy={n.cy} r={n.r}
          fill={n.id === 'hub' ? '#FCD34D' : '#9CA3AF'}
          className={n.id === 'hub' ? 'gp-node-hub' : 'gp-node'}
          style={{ animationDelay: `${Math.random() * 0.8}s` }}
        />
      ))}
    </svg>
  );
}

export function NetworkGraphSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
      <GraphSVG className="w-[520px] opacity-50" />
      <p className="animate-pulse text-base text-gray-500" role="status">Loading network...</p>
    </div>
  );
}

export function NetworkSidePanelSkeleton() {
  return (
    <div className="border-border-primary flex h-full w-[300px] shrink-0 flex-col overflow-hidden border xl:w-[375px]">
      {/* Header bar */}
      <div className="bg-border-secondary border-border-primary flex h-14 items-center justify-between border-b px-4">
        <SkeletonBar className="h-4 w-24" />
        <SkeletonBar className="h-5 w-20 rounded-full" />
      </div>
      {/* Name + meta */}
      <div className="space-y-2 px-4 pt-3 pb-2">
        <SkeletonBar className="h-5 w-3/4" />
        <SkeletonBar className="h-3 w-1/3" />
        <div className="border-t border-gray-200 pt-2">
          <SkeletonBar className="h-4 w-28" />
        </div>
      </div>
      {/* Content rows */}
      <div className="flex-1 space-y-3 px-4 pt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <SkeletonBar className="h-4 w-2/3" />
            <SkeletonBar className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustryListSkeleton() {
  return (
    <ul className="divide-y divide-gray-200 rounded-xl border border-l-2 border-gray-200 bg-white/80">
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between px-6 py-6">
          <SkeletonBar className="h-4 w-40" />
          <SkeletonBar className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
