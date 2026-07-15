import React from 'react';
import PropTypes from 'prop-types';

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

  return (
    <div className={`${RATING_ROW_GRID} py-3`}>
      <span className="text-heading-xs text-core-black">{label}</span>

      <div
        className="flex h-3.5 overflow-hidden rounded-full bg-background-secondary"
        role="img"
        aria-label={`${label} rating distribution across ${rated} rated facilities`}
      >
        {segments.map((seg) => (
          /* flex-grow proportional to count keeps the segments summing to the
             full bar width with no rounding drift; zero-count levels collapse. */
          <div
            key={seg.star}
            className={seg.colorClass}
            style={{ flexGrow: seg.count }}
            title={`${seg.star}★: ${seg.count} (${Math.round(seg.pct)}%)`}
          />
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
