import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const POSITION_CLASSES = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  right: 'top-1/2 left-6 -translate-y-1/2',
};

const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-paragraph-sm',
};

export default function Tooltip({
  children,
  className,
  position = 'top',
  size = 'xs',
}) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute z-50 hidden w-max rounded-md bg-zinc-900 px-3 py-2 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100',
        POSITION_CLASSES[position],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  position: PropTypes.oneOf(Object.keys(POSITION_CLASSES)),
  size: PropTypes.oneOf(Object.keys(SIZE_CLASSES)),
};
