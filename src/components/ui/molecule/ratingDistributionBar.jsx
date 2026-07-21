import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tooltip from '../atom/tooltip';

/**
 * One metric row of the facility rating distribution: the metric label, a
 * 100%-wide stacked bar of its star-level shares, and the cumulative
 * "below 3 stars" percentage.
 *
 * The shared grid template is exported so the section header ("Rating Type" /
 * "Below 3 Stars") can align its columns to these rows.
 */

// Column template shared with the section header so the three columns line up.
export const RATING_ROW_GRID =
  'grid grid-cols-[6.5rem_1fr_3.75rem] items-center gap-4';

export default function RatingDistributionBar({ metric }) {
  const { label, rated, segments, belowThreePct } = metric;

  /* Round only the outer ends of the visible bar rather than clipping the whole
     track with overflow-hidden — that clipping would also hide the hover
     tooltips, which sit above each segment. */
  const firstIdx = segments.findIndex((seg) => seg.count > 0);
  const lastIdx = segments.findLastIndex((seg) => seg.count > 0);

  return (
    <div className={`${RATING_ROW_GRID} py-3`}>
      <span className="text-heading-xs text-core-black">{label}</span>

      <div
        className="bg-background-secondary flex h-3.5 rounded-full"
        role="img"
        aria-label={`${label} rating distribution across ${rated} rated facilities`}
      >
        {segments.map((seg, i) => (
          /* flex-grow proportional to count keeps the segments summing to the
             full bar width with no rounding drift; zero-count levels collapse. */
          <div
            key={seg.star}
            className={clsx(
              'group relative',
              seg.colorClass,
              i === firstIdx && 'rounded-l-full',
              i === lastIdx && 'rounded-r-full',
            )}
            style={{ flexGrow: seg.count }}
          >
            {seg.count > 0 && (
              <Tooltip position="top">
                <span className="mr-1.5">{seg.star}★:</span>
                {seg.count} {seg.count === 1 ? 'facility' : 'facilities'} (
                {Math.round(seg.pct)}%)
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      <span className="text-heading-xs text-core-black text-right">
        {belowThreePct == null ? '—' : `${belowThreePct}%`}
      </span>
    </div>
  );
}

RatingDistributionBar.propTypes = {
  metric: PropTypes.shape({
    label: PropTypes.string.isRequired,
    rated: PropTypes.number.isRequired,
    belowThreePct: PropTypes.number,
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        star: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
        pct: PropTypes.number.isRequired,
        colorClass: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};
