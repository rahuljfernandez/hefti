import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { STATE_PATHS, VIEW_W, VIEW_H } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';
import { StateMapCard } from './listContainerContent';

/* Gap (px) between the cursor and the floating tooltip so the card never sits
   directly under the pointer. */
const TOOLTIP_GAP = 12;

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
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  /* Last cursor position in container-relative px + container size, captured on
     mousemove. Kept in a ref (not state) so tracking the cursor never triggers a
     re-render of the 51 <path>s — the tooltip is positioned imperatively. */
  const pointerRef = useRef(null);

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

  /* Write the tooltip's position straight to the DOM from the last known cursor
     point. Flips toward the interior once the cursor crosses each midline so the
     card opens back over the map and never clips at the edges. No-op until the
     card is mounted and the cursor has been tracked. */
  const positionTooltip = useCallback(() => {
    const el = tooltipRef.current;
    const p = pointerRef.current;
    if (!el || !p) return;
    const flipX = p.x > p.w * 0.55;
    const flipY = p.y > p.h * 0.55;
    el.style.left = `${p.x + (flipX ? -TOOLTIP_GAP : TOOLTIP_GAP)}px`;
    el.style.top = `${p.y + (flipY ? -TOOLTIP_GAP : TOOLTIP_GAP)}px`;
    el.style.transform = `translate(${flipX ? '-100%' : '0'}, ${
      flipY ? '-100%' : '0'
    })`;
  }, []);

  /* Cursor tracking updates a ref and repositions the tooltip imperatively —
     deliberately no setState here, so the map does not re-render on every move. */
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
    positionTooltip();
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

  /* Place the tooltip the moment it mounts (or switches states), using the last
     tracked cursor point, before paint — avoids a one-frame flash at 0,0. */
  useLayoutEffect(() => {
    positionTooltip();
  }, [floatingCard, positionTooltip]);

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
            ref={tooltipRef}
            className="pointer-events-none absolute top-0 left-0 z-10"
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
