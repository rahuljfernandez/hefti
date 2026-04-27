import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export default function SimplePagination({ currentPage, totalItems, pageSize, onPrev, onNext }) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const isFirst = currentPage === 1;
  const isLast = end >= totalItems;

  return (
    <nav
      aria-label="Pagination"
      className="border-border-primary flex items-center justify-between border-t py-3"
    >
      <div className="hidden sm:block">
        <p className="text-paragraph-base text-content-secondary">
          Showing <span className="font-medium">{start}–{end}</span> of{' '}
          <span className="font-medium">{totalItems}</span>
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
            'focus-ring-light text-paragraph-base text-content-secondary relative inline-flex items-center rounded-md bg-white px-3 py-2 inset-ring inset-ring-gray-300',
            isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:cursor-pointer',
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
            'focus-ring-light text-paragraph-base text-content-secondary relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 inset-ring inset-ring-gray-300',
            isLast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:cursor-pointer',
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
};
