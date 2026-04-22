import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import BreadcrumbLayoutCard from '../atom/breadcrumbLayoutCard';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Breadcrumb navigation component.
 * Sourced from Application UI and customized for Hefti.
 *
 * - Mobile: renders a "Go back" button using navigate(-1).
 * - Desktop (sm+): renders the full breadcrumb trail as a linked list.
 *   The current page renders as plain text; all ancestors render as links.
 * - Wrapped in BreadcrumbLayoutCard for consistent spacing across pages.
 * - Page definitions are centralised in src/lib/breadcrumbPages.js.
 * - flex-wrap on the ol handles long page names without overflow.
 */

export default function Breadcrumb({ pages }) {
  const navigate = useNavigate();
  return (
    <BreadcrumbLayoutCard className="bg-background-primary">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl">
        <div className="flex w-full items-center justify-between xl:px-6">
          <div>
            {/* Mobile: Go Back */}
            <div className="flex items-center sm:hidden">
              <ChevronLeftIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-blue-700"
              />
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-paragraph-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                Go back
              </button>
            </div>
            {/* Desktop */}
            <ol
              role="list"
              className="hidden items-center gap-x-1 sm:flex sm:flex-wrap"
            >
              {pages.map((page, i) => {
                const isFirst = i === 0;
                return (
                  <li key={page.to}>
                    <div className="flex items-center">
                      {!isFirst && (
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="text-core-black size-5 shrink-0"
                        />
                      )}
                      {page.current ? (
                        <span
                          aria-current="page"
                          className="text-paragraph-sm text-core-black font-semibold"
                        >
                          {page.name}
                        </span>
                      ) : (
                        <Link
                          to={page.to}
                          className="text-paragraph-sm text-core-black rounded-sm hover:text-content-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                        >
                          {page.name}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </nav>
    </BreadcrumbLayoutCard>
  );
}

Breadcrumb.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      current: PropTypes.bool,
    }),
  ).isRequired,
};
