import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { STATE_PATHS, VIEW_W, VIEW_H } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';
import { StateMapCard } from './listContainerContent';

/* True on touch/no-hover devices (phones, iPads in touch mode). Drives the
   interaction model: hover is impossible there, so tapping must do the work.
   Uses the input-capability media queries, not user-agent sniffing. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return coarse;
}

/**
 * US choropleth rendered as an inline SVG. Fills each state from `data`
 * ({ [stateName]: bucketIndex }) via the shared slate scale; the active state is
 * outlined in the app's hover-blue and lifted above its neighbors so the outline
 * is never clipped.
 *
 * The interaction model branches on pointer type:
 * - Fine pointer (mouse): hovering a state shows its StateMapCard as a tooltip
 *   that follows the cursor and flips toward the map interior near the edges so
 *   it never clips; clicking the state calls onStateSelect (navigates).
 * - Coarse pointer (touch): hover doesn't exist, so tapping a state selects it
 *   (outline persists) and its StateMapCard renders in a fixed panel below the
 *   map with a real, tappable profile link. Tapping another state moves the
 *   selection.
 */
export default function UsStatesMap({
  data = {},
  cards = {},
  onStateSelect,
  className = '',
}) {
  const coarse = useCoarsePointer();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  /* The state to outline/lift: the tapped one on touch, the hovered one on mouse. */
  const active = coarse ? selected : hovered;

  /* Render order: everything except the active state first, then the active
     state last so its outline paints on top of adjacent borders. */
  const ordered = useMemo(() => {
    if (!active) return STATE_PATHS;
    return [
      ...STATE_PATHS.filter((s) => s.name !== active),
      ...STATE_PATHS.filter((s) => s.name === active),
    ];
  }, [active]);

  /* Track the cursor in container-relative pixels so the tooltip can be placed
     with plain CSS regardless of the SVG's responsive scaling. */
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePathClick = (name) => {
    if (coarse) {
      /* No card = no data (e.g. DC); clear rather than outline an empty panel. */
      setSelected(cards[name] ? name : null);
    } else {
      onStateSelect?.(name);
    }
  };

  /* Floating tooltip (mouse only); panel card (touch only). */
  const floatingCard = !coarse && hovered ? cards[hovered] : null;
  const panelCard = coarse && selected ? cards[selected] : null;

  /* Flip toward the interior once the cursor crosses each midline; a small gap
     keeps the card off the cursor so it doesn't cover the hovered state. */
  const rect = containerRef.current?.getBoundingClientRect();
  const flipX = rect ? pos.x > rect.width * 0.55 : false;
  const flipY = rect ? pos.y > rect.height * 0.55 : false;
  const GAP = 12;

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative"
        onMouseMove={handleMouseMove}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Choropleth map of the United States by state rating"
        >
          {ordered.map((state) => {
            const isActive = state.name === active;
            return (
              <path
                key={state.name}
                d={state.d}
                fill={bucketColor(data[state.name])}
                stroke={isActive ? '#3b82f6' : '#ffffff'}
                strokeWidth={isActive ? 2 : 0.75}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => setHovered(state.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handlePathClick(state.name)}
                aria-label={state.name}
              />
            );
          })}
        </svg>

        {floatingCard && (
          <div
            className="pointer-events-none absolute top-0 left-0 z-10"
            style={{
              left: pos.x + (flipX ? -GAP : GAP),
              top: pos.y + (flipY ? -GAP : GAP),
              transform: `translate(${flipX ? '-100%' : '0'}, ${
                flipY ? '-100%' : '0'
              })`,
            }}
          >
            <StateMapCard item={floatingCard} />
          </div>
        )}
      </div>

      {/* Touch: selected-state card in a fixed panel below the map. */}
      {panelCard && (
        <div className="mt-4 flex justify-center">
          <StateMapCard
            item={panelCard}
            interactive
            className="w-full max-w-sm"
          />
        </div>
      )}
    </div>
  );
}

UsStatesMap.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  cards: PropTypes.objectOf(PropTypes.object),
  onStateSelect: PropTypes.func,
  className: PropTypes.string,
};
