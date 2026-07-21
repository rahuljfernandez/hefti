import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * A single headline figure with a dated caption — used for the Key Financials
 * row (Transfer Price / Assessed Value / Market Value).
 *
 * Separate from statsCard rather than a third variant of it: both variants
 * there are built around a comparison Badge and a description line, neither of
 * which this design has.
 *
 * Values arrive pre-formatted from propertyMetrics — this renders, it does not
 * format.
 */
export default function PropertyStatCard({ label, value, asOf, className }) {
  return (
    <div
      className={clsx(
        'border-border-primary rounded-lg border bg-white px-4 py-5 sm:px-6',
        className,
      )}
    >
      <p className="text-label-sm text-content-secondary">{label}</p>
      <p className="text-heading-sm text-core-black mt-2">{value}</p>
      {asOf && (
        <p className="text-paragraph-xs text-content-secondary mt-1">
          As of {asOf}
        </p>
      )}
    </div>
  );
}

PropertyStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  asOf: PropTypes.string,
  className: PropTypes.string,
};
