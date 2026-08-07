import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * A single headline figure: label, value, and an optional caption line, plus an
 * optional inline `aside` after the value, a leading `icon`, and an `accent`
 * tint.
 *
 * Purely presentational — no domain knowledge. Captions arrive fully formed
 * (e.g. "As of 2025"), so the caller owns any prefixing and the card stays
 * reusable anywhere.
 *
 * Values arrive pre-formatted — this renders, it does not format.
 */
export default function StatFigureCard({
  label,
  value,
  caption,
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
        <p className="text-heading-md text-core-black">{value}</p>
        {aside && (
          <span className="text-paragraph-base text-content-secondary">
            {aside}
          </span>
        )}
      </div>

      {caption && (
        <p className="text-paragraph-base text-content-secondary mt-1">
          {caption}
        </p>
      )}
    </div>
  );
}

StatFigureCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  caption: PropTypes.node,
  aside: PropTypes.string,
  icon: PropTypes.elementType,
  accent: PropTypes.oneOf(['amber']),
  className: PropTypes.string,
};
