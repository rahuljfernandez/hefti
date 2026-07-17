import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { STATE_PATHS, VIEW_W, VIEW_H } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';
import { StateMapCard } from './listContainerContent';

/**
 * Hoverable US choropleth rendered as an inline SVG. Fills each state from
 * `data` ({ [stateName]: bucketIndex }) via the shared slate scale; on hover the
 * state is outlined in the app's hover-blue and lifted above its neighbors so
 * the outline is never clipped.
 *
 * When `cards` ({ [stateName]: cardItem }) has an entry for the hovered state,
 * a StateMapCard tooltip follows the cursor. To keep edge states (Maine, Florida,
 * California, Washington) from clipping, the card flips to the opposite side of
 * the cursor once the pointer passes the horizontal/vertical midlines of the
 * container, so it always opens back toward the map's interior.
 */
export default function UsStatesMap({
  data = {},
  cards = {},
  onStateSelect,
  className = '',
}) {
  const [hovered, setHovered] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  /* Render order: everything except the hovered state first, then the hovered
     state last so its outline paints on top of adjacent borders. */
  const ordered = useMemo(() => {
    if (!hovered) return STATE_PATHS;
    return [
      ...STATE_PATHS.filter((s) => s.name !== hovered),
      ...STATE_PATHS.filter((s) => s.name === hovered),
    ];
  }, [hovered]);

  /* Track the cursor in container-relative pixels so the tooltip can be placed
     with plain CSS regardless of the SVG's responsive scaling. */
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const card = hovered ? cards[hovered] : null;

  /* Flip toward the interior once the cursor crosses each midline; a small gap
     keeps the card off the cursor so it doesn't cover the hovered state. */
  const rect = containerRef.current?.getBoundingClientRect();
  const flipX = rect ? pos.x > rect.width * 0.55 : false;
  const flipY = rect ? pos.y > rect.height * 0.55 : false;
  const GAP = 12;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Choropleth map of the United States by state rating"
      >
        {ordered.map((state) => {
          const isHovered = state.name === hovered;
          return (
            <path
              key={state.name}
              d={state.d}
              fill={bucketColor(data[state.name])}
              stroke={isHovered ? '#3b82f6' : '#ffffff'}
              strokeWidth={isHovered ? 2 : 0.75}
              className="cursor-pointer transition-colors duration-150"
              onMouseEnter={() => setHovered(state.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onStateSelect?.(state.name)}
              aria-label={state.name}
            />
          );
        })}
      </svg>

      {card && (
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
          <StateMapCard item={card} />
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
