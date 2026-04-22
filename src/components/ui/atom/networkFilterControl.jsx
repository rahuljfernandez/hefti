import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

/**
 * Reusable component for the buttons/controls inthe network filter
 *
 * props:
 * -value: either a number/string that describes what filter is applied
 * -active: boolean value determined by state managment
 * -onClick: sets the state
 * -ariaLabel: optional accessible label for abbreviated button text (e.g. "RPTOE")
 *
 * Example usage {
 *  <SegmentButton
    value={1}
    active={depth === 1}
    onClick={() => onSetDepth(1)}
    />
 * }
 *  Future:  Add color props etc
 */

export default function NetworkFilterControl({ value, active, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active ?? false}
      aria-label={ariaLabel}
      className={clsx(
        'text-label-xs text-core-black border-border-primary h-10 rounded-md border transition hover:cursor-pointer',
        active ? 'bg-zinc-200' : 'bg-zinc-100 hover:bg-zinc-50',
      )}
    >
      {value}
    </button>
  );
}

NetworkFilterControl.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};
