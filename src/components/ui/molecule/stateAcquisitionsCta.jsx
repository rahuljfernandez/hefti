import React from 'react';
import PropTypes from 'prop-types';
import AcquisitionsCtaBanner from './acquisitionsCtaBanner';

/* Ownership-changes call-to-action for the State Profile page. Summarizes how
   many ownership changes were recorded across the state. */

export default function StateAcquisitionsCta({
  stateName,
  changeCount,
  to = '/acquisitions',
}) {
  return (
    <AcquisitionsCtaBanner to={to} label="View ownership records" className="mt-8">
      HEFTI has recorded{' '}
      <span className="font-bold">{changeCount} ownership changes</span> across{' '}
      {stateName} facilities in the past year.
    </AcquisitionsCtaBanner>
  );
}

StateAcquisitionsCta.propTypes = {
  stateName: PropTypes.string.isRequired,
  changeCount: PropTypes.number.isRequired,
  to: PropTypes.string,
};
