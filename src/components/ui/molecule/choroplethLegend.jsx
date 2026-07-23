import React from 'react';
import PropTypes from 'prop-types';
import { CHOROPLETH_SCALE } from '../../../lib/stateChoroplethMetrics';

/**
 * Legend for the "Explore by State" choropleth: a row of the five sequential
 * swatches bracketed by "Lower-rated" / "Higher-rated" end captions. Reads its
 * colors from CHOROPLETH_SCALE so it always matches the map fills.
 */
export default function ChoroplethLegend({
  lowLabel = 'Lower-rated',
  highLabel = 'Higher-rated',
}) {
  return (
    <div className="text-label-xs text-content-secondary inline-flex items-center gap-3">
      <span className="whitespace-nowrap">{lowLabel}</span>
      <span className="flex overflow-hidden rounded-sm">
        {/* Reversed: the scale runs light → dark from best- to worst-rated, but
            the legend reads worst → best, so the dark end leads. */}
        {[...CHOROPLETH_SCALE].reverse().map(({ bucket, hex, token }) => (
          <span
            key={bucket}
            className="h-2.5 w-8"
            style={{ backgroundColor: hex }}
            title={token}
          />
        ))}
      </span>
      <span className="whitespace-nowrap">{highLabel}</span>
    </div>
  );
}

ChoroplethLegend.propTypes = {
  lowLabel: PropTypes.string,
  highLabel: PropTypes.string,
};
