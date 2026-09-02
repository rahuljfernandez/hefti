import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Data-year caption for the home-page state sections.
 *
 * The five state metrics don't share a coverage window — the ratings run to the
 * current panel year while operating margin trails it — so switching the active
 * metric can change the year behind the numbers with nothing on screen saying
 * so. This keeps that year beside the control that changes it.
 *
 * Reads `meta.year` / `meta.isFallback` off a /api/state-metrics metric; renders
 * nothing when the year is unknown.
 */
export default function DataYearChip({ year, isFallback = false, className }) {
  if (year == null) return null;

  return (
    <span className={clsx('text-label-xs text-content-secondary', className)}>
      (<span className="text-content-primary font-medium">{year}</span> data
      {isFallback && ' · latest available'})
    </span>
  );
}

DataYearChip.propTypes = {
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFallback: PropTypes.bool,
  className: PropTypes.string,
};
