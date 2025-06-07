import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import BreadcrumbLayoutCard from '../atom/breadcrumbLayoutCard';
import { Button } from '../atom/button';

/**
 * Component is sourced from Application UI
 * Removed extra stock code and added code for button
 * Wrapped in a custom layout card to apply spacing
 * Could be design issues with very long page names in the Li's, especially if there are 3-4 li's
 * Applied flex wrap to Ol to mitigate this and simple "Go back" option for mobile.
 */

const defaultPages = [
  { name: 'Home Page', href: '#', current: false },
  { name: 'Previous Page', href: '#', current: false },
  { name: 'Current Page', href: '#', current: true },
];
//Ask Nick about hover color, leaving stock for now
export default function Breadcrumb({ pages = defaultPages }) {
  return (
    <BreadcrumbLayoutCard className="bg-zinc-200">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl">
        <div className="flex w-full items-center justify-between">
          <div>
            {/* Mobile: Go Back link */}
            <div className="flex items-center justify-between sm:hidden">
              <ChevronLeftIcon className="size-5 shrink-0 text-blue-700" />
              <a
                href="#"
                className="text-paragraph-sm font-medium text-blue-700 hover:underline"
              >
                Go back
              </a>
            </div>
            {/* Desktop */}
            <ol
              role="list"
              className="hidden items-center sm:flex sm:flex-wrap"
            >
              {pages.map((page, index) => {
                const isFirst = index === 0;

                return (
                  <li key={page.name + index}>
                    <div className="flex items-center">
                      {!isFirst && (
                        <ChevronRightIcon
                          aria-hidden="true"
                          className={`text-core-black size-5 shrink-0 ${page.current ? 'font-semibold' : ''}`}
                        />
                      )}
                      <a
                        href={page.href}
                        aria-current={page.current ? 'page' : undefined}
                        className={`text-paragraph-sm text-core-black hover:text-gray-700 ${page.current ? 'font-semibold' : ''}`}
                      >
                        {page.name}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          {/* Report Builder*/}
          <div className="">
            <Button
              href="#"
              className="text-label-base bg-background-inverse-primary border-border-inverse-primary inline-flex h-10 items-center border whitespace-nowrap"
            >
              Report Builder
            </Button>
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
      href: PropTypes.string.isRequired,
      current: PropTypes.bool,
    }),
  ).isRequired,
};
