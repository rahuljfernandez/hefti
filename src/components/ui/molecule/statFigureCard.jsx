import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * A single headline figure: label, value, and an optional caption line.
 *
 * Renders a dt/dd pair inside its card box, so it must sit in a `<dl>` — the
 * caller owns that wrapper, which is also what lays the cards out in a grid.
 * Without it the value reaches a screen reader with no name attached.
 *
 * Purely presentational — no domain knowledge. Captions arrive fully formed
 * (e.g. "As of 2025"), so the caller owns any prefixing and the card stays
 * reusable anywhere.
 *
 * Values arrive pre-formatted — this renders, it does not format.
 */
export default function StatFigureCard({ label, value, caption, className }) {
  return (
    <div
      className={clsx(
        'border-border-primary bg-core-white rounded-lg border px-4 py-5 shadow-sm sm:px-6',
        className,
      )}
    >
      <dt className="text-label-lg text-content-secondary">{label}</dt>

      <dd className="mt-2">
        <p className="text-heading-md text-core-black">{value}</p>

        {caption && (
          <p className="text-paragraph-base text-content-secondary mt-1">
            {caption}
          </p>
        )}
      </dd>
    </div>
  );
}

StatFigureCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  caption: PropTypes.node,
  className: PropTypes.string,
};
