import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { STATE_PATHS } from '../../../lib/usStatesGeo';
import { bucketColor } from '../../../lib/stateChoroplethMetrics';

/* stateName → { d, bounds } for an O(1) lookup when rendering a single-state
   silhouette. bounds ([[x0,y0],[x1,y1]]) becomes the card's own viewBox so the
   state is cropped and centered instead of drawn tiny inside the full US frame. */
const GEO_BY_NAME = new Map(STATE_PATHS.map((s) => [s.name, s]));

/* Buckets 3–4 are dark enough to need white text on the rank badge; 0–2 keep
   near-black. Keeps the badge legible across the full slate scale. */
const badgeTextColor = (bucket) => (bucket >= 3 ? '#ffffff' : '#1e293b');

/* Padded viewBox around a state's projected bounds. */
function boundsViewBox([[x0, y0], [x1, y1]]) {
  const w = x1 - x0;
  const h = y1 - y0;
  const pad = Math.max(w, h) * 0.08;
  return `${x0 - pad} ${y0 - pad} ${w + pad * 2} ${h + pad * 2}`;
}

/**
 * One state in the home-page State Rankings grid: a bucket-colored silhouette,
 * a rank badge, the state name, and its metric value. The whole card links to the
 * facilities browse pre-filtered by state and pre-sorted by the active metric.
 *
 * Silhouette fill and badge share the state's choropleth bucket color, so the grid
 * reads like the "Explore by State" map. The card lifts slightly on hover.
 *
 * Expected item (from buildStateRankingCards in stateRankingsMetrics.js):
 * - stateName, stateCode, rank, bucket, displayValue, valueSuffix, to
 */
export default function StateShapeCard({ item }) {
  const geo = GEO_BY_NAME.get(item.stateName);
  const fill = bucketColor(item.bucket);

  const valueText = item.valueSuffix
    ? `${item.displayValue} ${item.valueSuffix}`
    : item.displayValue;

  return (
    <Link
      to={item.to}
      state={{ from: 'rankings' }}
      aria-label={`${item.stateName}, ranked number ${item.rank}, ${valueText}`}
      className="focus-ring-light border-border-primary flex flex-col items-center rounded-lg border bg-white p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
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

      {geo ? (
        <svg
          viewBox={boundsViewBox(geo.bounds)}
          preserveAspectRatio="xMidYMid meet"
          className="h-12 w-full"
          role="img"
          aria-hidden="true"
        >
          <path d={geo.d} fill={fill} />
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
