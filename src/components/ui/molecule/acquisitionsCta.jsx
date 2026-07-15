import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

/* Ownership-changes call-to-action for the State Profile page. Summarizes how
   many ownership changes were recorded across the state and links out to the
   acquisitions page. That page doesn't exist yet, so the link is a placeholder
   until the route is built. */
export default function AcquisitionsCta({ stateName, changeCount, to }) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-xl bg-linear-to-r from-purple-50 to-purple-200 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-paragraph-base text-content-primary">
        HEFTI has recorded{' '}
        <span className="font-bold">{changeCount} ownership changes</span> across{' '}
        {stateName} facilities in the past year.
      </p>
      <Link
        to={to}
        className="focus-ring-light inline-flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-label-base text-white hover:bg-zinc-800"
      >
        View ownership records
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

AcquisitionsCta.propTypes = {
  stateName: PropTypes.string.isRequired,
  changeCount: PropTypes.number.isRequired,
  to: PropTypes.string,
};

AcquisitionsCta.defaultProps = {
  to: '/acquisitions',
};
