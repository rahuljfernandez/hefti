import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { STATE_PATHS, VIEW_W, VIEW_H } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';

/**
 * Hoverable US choropleth rendered as an inline SVG. Fills each state from
 * `data` ({ [stateName]: bucketIndex }) via the shared slate scale; on hover the
 * state is outlined in the app's hover-blue and lifted above its neighbors so
 * the outline is never clipped.
 *
 * This pass has no tooltip or selection — hover is purely presentational.
 */
export default function UsStatesMap({ data = {}, className = '' }) {
  const [hovered, setHovered] = useState(null);

  /* Render order: everything except the hovered state first, then the hovered
     state last so its outline paints on top of adjacent borders. */
  const ordered = useMemo(() => {
    if (!hovered) return STATE_PATHS;
    return [
      ...STATE_PATHS.filter((s) => s.name !== hovered),
      ...STATE_PATHS.filter((s) => s.name === hovered),
    ];
  }, [hovered]);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={`h-auto w-full ${className}`}
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
          >
            <title>{state.name}</title>
          </path>
        );
      })}
    </svg>
  );
}

UsStatesMap.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
  className: PropTypes.string,
};
