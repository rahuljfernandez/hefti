import React, { useId } from 'react';
import PropTypes from 'prop-types';
import LayoutPage from '../atom/layout-page';
import { Heading } from '../atom/heading';
import BrowsePagination from '../molecule/browsePagination';
import SelectMenu from '../molecule/selectMenu';
import SearchMenu from '../molecule/searchMenu';

/**
 * Reusable layout shell for browse pages.
 *
 * Responsibilities:
 * - Renders the page heading plus search, sort, and filter controls
 * - Wraps the supplied list content in a named results region
 * - Displays pagination below the results when needed
 */
export default function BrowseListView({
  title,
  children,
  searchPlaceholder,
  currentPage,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  onSortChange,
  onStateChange,
  suggestions,
  hasFetchedSuggestions,
  type,
}) {
  const searchHeadingId = useId();
  const resultsHeadingId = useId();

  return (
    <LayoutPage>
      <section className="pt-4 pb-16">
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>

        {/*Search Bar */}
        <div className="py-8">
          <Heading id={searchHeadingId} level={2} className="text-label-lg">
            {' '}
            Search by name
          </Heading>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
            <div className="w-full md:flex-[2]">
              <SearchMenu
                accessibleLabel="Search by name"
                type={type}
                placeholder={searchPlaceholder}
                search={search}
                onSearchChange={onSearchChange}
                suggestions={suggestions}
                hasFetchedSuggestions={hasFetchedSuggestions}
              />
            </div>
            <div className="flex w-full gap-2 md:flex-[1] md:flex-row">
              <SelectMenu
                variant="sort"
                onSortChange={onSortChange}
                accessibleLabel="Sort results"
              />
              <SelectMenu
                variant="filter"
                onStateChange={onStateChange}
                accessibleLabel="Filter by state"
              />
            </div>
          </div>
        </div>

        {/*List items */}
        <div role="region" aria-labelledby={resultsHeadingId}>
          <Heading id={resultsHeadingId} level={2} className="sr-only">
            Results
          </Heading>
          {children}
        </div>

        {/*Pagination Scroll */}
        {totalPages > 1 && (
          <div className="pt-8">
            <BrowsePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </section>
    </LayoutPage>
  );
}

BrowseListView.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  search: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  suggestions: PropTypes.array,
  hasFetchedSuggestions: PropTypes.bool,
  onSortChange: PropTypes.func,
  onStateChange: PropTypes.func,
  type: PropTypes.string,
};
