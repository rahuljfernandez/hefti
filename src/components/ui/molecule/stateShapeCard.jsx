import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { STATE_CARD_SHAPES, CARD_VIEW } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';

/* Buckets 3–4 are dark enough to need white text on the rank badge; 0–2 keep
   near-black. Keeps the badge legible across the full slate scale. */
const badgeTextColor = (bucket) => (bucket >= 3 ? '#ffffff' : '#1e293b');

/**
 * One state in the home-page State Rankings grid: a bucket-colored silhouette,
 * a rank badge, the state name, and its metric value. The whole card links to the
 * facilities browse pre-filtered by state and pre-sorted by the active metric.
 *
 * Silhouette fill and badge share the state's choropleth bucket color, so the grid
 * reads like the "Explore by State" map. On hover the card lifts slightly and its
 * border takes that same bucket color (via the --card-accent custom property, since
 * the color is data-driven per state and can't be a static class).
 *
 * Expected item (from buildStateRankingCards in stateRankingsMetrics.js):
 * - stateName, stateCode, rank, bucket, displayValue, valueSuffix, to
 */
export default function StateShapeCard({ item }) {
  const shapeD = STATE_CARD_SHAPES[item.stateName];
  const fill = bucketColor(item.bucket);

  const valueText = item.valueSuffix
    ? `${item.displayValue} ${item.valueSuffix}`
    : item.displayValue;

  return (
    <Link
      to={item.to}
      state={{ from: 'rankings' }}
      aria-label={`${item.stateName}, ranked number ${item.rank}, ${valueText}`}
      style={{ '--card-accent': fill }}
      className="focus-ring-light border-border-primary bg-core-white flex flex-col items-center rounded-lg border p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-(--card-accent) hover:shadow-md"
    >
      <div className="mb-1 flex w-full justify-end">
        <span
          aria-hidden="true"
          className="text-paragraph-xs rounded-md px-1.5 py-0.5 font-semibold"
          style={{ backgroundColor: fill, color: badgeTextColor(item.bucket) }}
        >
          #{item.rank}
        </span>
      </div>

      {shapeD ? (
        <svg
          viewBox={`0 0 ${CARD_VIEW} ${CARD_VIEW}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-12 w-full"
          role="img"
          aria-hidden="true"
        >
          <path d={shapeD} fill={fill} />
        </svg>
      ) : (
        <div className="h-12" />
      )}

      <p className="text-paragraph-sm text-core-black mt-2 font-semibold">
        {item.stateName}
      </p>
      <p className="text-paragraph-xs text-content-secondary">{valueText}</p>
    </Link>
  );
}

StateShapeCard.propTypes = {
  item: PropTypes.shape({
    stateName: PropTypes.string.isRequired,
    stateCode: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    bucket: PropTypes.number.isRequired,
    displayValue: PropTypes.string,
    valueSuffix: PropTypes.string,
    to: PropTypes.string.isRequired,
  }).isRequired,
};
