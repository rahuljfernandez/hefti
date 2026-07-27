import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

/**
 * Segmented Best / Worst toggle for the state rankings grid.
 * Announces the active selection to screen readers via aria-pressed.
 */
export default function BestWorstToggle({ value, onChange }) {
  const options = ['Best', 'Worst'];
  return (
    <div
      role="group"
      aria-label="Sort order"
      className="text-label-sm border-border-primary flex overflow-hidden rounded-md border shadow-sm"
    >
      {options.map((option) => {
        const active = value === option.toLowerCase();
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option.toLowerCase())}
            aria-pressed={active}
            className={clsx(
              'focus-panel-light text-core-black px-3 py-1.5 transition-colors hover:cursor-pointer',
              active
                ? 'bg-background-primary'
                : 'bg-background-tertiary hover:bg-white',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

BestWorstToggle.propTypes = {
  value: PropTypes.oneOf(['best', 'worst']).isRequired,
  onChange: PropTypes.func.isRequired,
};
