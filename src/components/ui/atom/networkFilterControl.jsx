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

export default function NetworkFilterControl({ value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
};
