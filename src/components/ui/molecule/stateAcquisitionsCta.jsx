import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

/* Ownership-changes call-to-action for the State Profile page. Summarizes how
   many ownership changes were recorded across the state and links out to the
   acquisitions page. That page doesn't exist yet, so the link is a placeholder
   until the route is built. */
export default function StateAcquisitionsCta({ stateName, changeCount, to }) {
  return (
    <div className="border-border-primary mt-8 flex flex-col gap-4 rounded-xl border bg-linear-to-r from-purple-50 to-purple-200 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-paragraph-base text-content-primary">
        HEFTI has recorded{' '}
        <span className="font-bold">{changeCount} ownership changes</span>{' '}
        across {stateName} facilities in the past year.
      </p>
      <Link
        to={to}
        className="focus-ring-light inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
      >
        View ownership records
        <ArrowRightIcon className="size-5" aria-hidden="true" />
      </Link>
    </div>
  );
}

StateAcquisitionsCta.propTypes = {
  stateName: PropTypes.string.isRequired,
  changeCount: PropTypes.number.isRequired,
  to: PropTypes.string,
};

StateAcquisitionsCta.defaultProps = {
  to: '/acquisitions',
};
