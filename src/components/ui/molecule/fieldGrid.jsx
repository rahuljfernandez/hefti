import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Two-column label/value grid — the plain, ruleless metadata layout used for
 * blocks of identifiers (addresses, parcel numbers, certification dates).
 * Fields flow row-major: left, right, left, right…
 *
 * Not to be confused with DetailTable, the ruled label/value design used inside
 * the Property Details disclosures.
 *
 * TODO: additionalInformation.jsx and facilityProfileDescription.jsx hand-roll
 * byte-identical markup and should be swapped over in a standalone PR. Note
 * facilityProfileDescription hardcodes its labels uppercase in the JSX; those
 * need lowering to canonical case as part of the move.
 */

/* Caps are applied via CSS (`valueClassName="uppercase"`), never baked into the
   string — an all-caps DOM value follows the text into copy/paste and exports,
   and some screen readers spell it out letter by letter. */
export default function FieldGrid({ fields, className, valueClassName }) {
  return (
    <dl className={clsx('grid grid-cols-1 sm:grid-cols-2', className)}>
      {fields.map(({ label, value }) => (
        <div key={label} className="px-4 pb-6 sm:col-span-1 sm:px-0">
          <dt className="text-label-sm text-content-secondary uppercase">
            {label}
          </dt>
          <dd
            className={clsx(
              'text-paragraph-base text-content-primary mt-1',
              valueClassName,
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

FieldGrid.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node,
    }),
  ).isRequired,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
};
