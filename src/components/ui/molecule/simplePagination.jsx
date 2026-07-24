import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Simple previous / next pagination bar with a "Showing X–Y of Z" summary.
 * Buttons are disabled and marked aria-disabled at the first and last pages.
 *
 * Used in: src/components/ui/organism/stateRankingsHiLowViz.jsx
 */
export default function SimplePagination({
  currentPage,
  totalItems,
  pageSize,
  onPrev,
  onNext,
  divider = true,
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const isFirst = currentPage === 1;
  const isLast = end >= totalItems;

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        'flex items-center justify-between py-3',
        divider && 'border-border-primary border-t',
      )}
    >
      <div className="hidden sm:block">
        <p className="text-paragraph-base text-content-secondary">
          Showing{' '}
          <span className="font-medium">
            {start}–{end}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Go to previous page"
          aria-disabled={isFirst}
          className={clsx(
            'focus-ring-light text-paragraph-base text-content-secondary relative inline-flex items-center rounded-md bg-white px-3 py-2 inset-ring inset-ring-border-primary',
            isFirst
              ? 'cursor-not-allowed opacity-50'
              : 'hover:cursor-pointer hover:bg-background-tertiary',
          )}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLast}
          aria-label="Go to next page"
          aria-disabled={isLast}
          className={clsx(
            'focus-ring-light text-paragraph-base text-content-secondary relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 inset-ring inset-ring-border-primary',
            isLast
              ? 'cursor-not-allowed opacity-50'
              : 'hover:cursor-pointer hover:bg-background-tertiary',
          )}
        >
          Next →
        </button>
      </div>
    </nav>
  );
}

SimplePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  divider: PropTypes.bool,
};
