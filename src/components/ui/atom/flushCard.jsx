import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Half of a card that wraps a flush element (e.g. a map) above or below it.
 *
 * `position="top"` rounds and shadows the top/left/right and sits flush on its
 * bottom edge; `position="bottom"` does the mirror. Stack a top card, the flush
 * element, and a bottom card and they read as one continuous card hugging the
 * element between them.
 *
 * Shares the white background and padding language of LayoutCard, minus the
 * full rounding — the flush edge is intentionally square so no seam shows.
 */
export default function FlushCard({ position, children, className }) {
  return (
    <div
      className={clsx(
        'bg-white px-4 shadow-sm sm:px-6',
        position === 'top'
          ? 'rounded-t-lg p-5 sm:p-6'
          : 'rounded-b-lg p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

FlushCard.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
