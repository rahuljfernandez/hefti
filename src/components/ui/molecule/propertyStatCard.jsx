import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * A single headline figure with a caption.
 *
 * Shared by the facility Key Financials row and the owner Portfolio Highlights
 * row, so the two read as one card family at one size.
 *
 *
 * Values arrive pre-formatted — this renders, it does not format.
 */
export default function PropertyStatCard({
  label,
  value,
  asOf,
  description,
  aside,
  icon: Icon,
  accent,
  className,
}) {
  const isAmber = accent === 'amber';

  return (
    <div
      className={clsx(
        'border-border-primary bg-core-white rounded-lg border px-4 py-5 shadow-sm sm:px-6',
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            aria-hidden="true"
            className={clsx(
              'size-5 shrink-0',
              isAmber ? 'text-amber-500' : 'text-content-secondary',
            )}
          />
        )}
        <p className="text-label-lg text-content-secondary">{label}</p>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <p
          className={clsx(
            'text-heading-md',
            isAmber ? 'text-amber-700' : 'text-core-black',
          )}
        >
          {value}
        </p>
        {aside && (
          <span className="text-paragraph-base text-content-secondary">
            {aside}
          </span>
        )}
      </div>

      {(asOf || description) && (
        <p className="text-paragraph-base text-content-secondary mt-1">
          {asOf ? `As of ${asOf}` : description}
        </p>
      )}
    </div>
  );
}

PropertyStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  asOf: PropTypes.string,
  description: PropTypes.string,
  aside: PropTypes.string,
  icon: PropTypes.elementType,
  accent: PropTypes.oneOf(['amber']),
  className: PropTypes.string,
};
