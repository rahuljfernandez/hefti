import React from 'react';
import PropTypes from 'prop-types';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { getVisiblePages } from '../../../lib/getVisiblePages';

/**
 *
 * This is a pagination component used for both Browse facility/owner with prev,next, context window.
 * Sourced from Application UI/ Centered page numbers, modified the center context window display.
 * The state is being managed by the top level parent and is prop-drilled to this component.
 * Imports getVisiblePages helper which returns an array that provides the context window.
 * 
 * example:
 *  <BrowsePagination
        currentPage={currentPage} - the current page
        totalPages={totalPages} - total pages number used to provide right bound of context
        onPageChange={onPageChange} -function to set a new current page in parent
    />
 *
 */

export default function BrowsePagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  console.log('currentPage', currentPage);
  console.log('totalPages', totalPages);
  return (
    <nav className="border-content-tertiary flex items-center justify-between border-t px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="text-paragraph-base text-content-secondary hover:border-content-secondary inline-flex items-center border-t-2 border-transparent pt-4 pr-1 hover:cursor-pointer hover:text-gray-700"
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="text-content-secondary mr-4 size-5"
          />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {getVisiblePages(currentPage, totalPages).map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="text-paragraph-base text-content-secondary inline-flex items-center border-t-2 border-transparent px-4 pt-4 font-medium"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`text-paragraph-base inline-flex items-center border-t-2 px-4 pt-4 ${
                page === currentPage
                  ? 'border-blue-700 text-blue-700'
                  : 'hover:border-content-secondary border-transparent text-gray-500 hover:cursor-pointer hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-paragraph-base text-content-secondary hover:border-content-secondary inline-flex items-center border-t-2 border-transparent pt-4 pl-1 hover:cursor-pointer hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="text-content-secondary ml-4 size-5"
          />
        </button>
      </div>
    </nav>
  );
}
BrowsePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
