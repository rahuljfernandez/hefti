import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BrowseListView from './browseListView';
import PropTypes from 'prop-types';
import { BrowseListSkeleton } from '../atom/skeletons.jsx';
import { ErrorBanner, NoResultsBanner } from '../atom/errorBanner.jsx';

/**
 * This component controls fetching data and search suggestions
 * Managing pagination, search, sort, and state filter URL params
 * Passing data and UI state to BrowseListView
 *
 * It receives props from Owners, Facilities, or Rankings pages to customize:
 * API endpoints
 * Display titles
 * Search placeholders
 * Routing behavior
 *
 * Rankings-only props (not used by Facilities or Owners):
 * - suggestionsEndpoint: overrides the default `${apiEndpoint}/suggestions` fetch URL.
 *   Used by Rankings to point individual-owners suggestions at /api/owners/suggestions.
 * - defaultSort: overrides the default sort direction ('asc'). Rankings defaults to 'desc'.
 * - sortOptions: custom sort labels/values passed to SelectMenu. Rankings uses Descending/Ascending.
 * - filterOptions: custom filter options passed to SelectMenu. Rankings uses ranking type switcher.
 * - filterAccessibleLabel: overrides the default "Filter by state" aria-label on the filter control.
 * - onFilterChange: when provided, replaces the default state-param filter behavior.
 *   Rankings uses this to navigate between ranking types instead of filtering by state.
 * - onSuggestionPick: when provided, overrides SearchMenu's default profile-page navigation.
 *   Rankings uses this to route chains to a filtered facility list and owners to their profile.
 */

BrowsePage.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  suggestionsEndpoint: PropTypes.string,
  title: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  renderList: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['facilities', 'owners', 'rankings']),
  sortOptions: PropTypes.array,
  defaultSort: PropTypes.oneOf(['asc', 'desc']),
  filterOptions: PropTypes.array,
  filterAccessibleLabel: PropTypes.string,
  onFilterChange: PropTypes.func,
  onSuggestionPick: PropTypes.func,
};

export default function BrowsePage({
  apiEndpoint,
  suggestionsEndpoint,
  title,
  searchPlaceholder,
  renderList,
  type,
  sortOptions,
  filterOptions,
  filterAccessibleLabel,
  onFilterChange,
  onSuggestionPick,
  defaultSort = 'asc',
}) {
  // // --- URL Params ---
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || defaultSort;
  const state = searchParams.get('state') || '';
  const chain = searchParams.get('chain') || '';
  // // --- UI State ---
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeQuery = search || state || chain;
  const resultAnnouncement = error
    ? 'Results failed to load.'
    : loading
      ? 'Loading results.'
      : data.length > 0
        ? `${data.length} results${activeQuery ? ` for ${activeQuery}` : ''}.`
        : `No results${activeQuery ? ` for ${activeQuery}` : ''}.`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page, sort, state });
    //  Only add search if it's not empty
    if (search.trim() !== '') params.set('search', search);
    if (chain.trim() !== '') params.set('chain', chain);

    fetch(`${apiEndpoint}?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((resData) => {
        setData(resData.data);
        setPageCount(resData.pageCount);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page, search, sort, state, chain, apiEndpoint]);

  //Fetch suggestions when user types in the search box
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setHasFetchedSuggestions(false);
      return;
    }

    fetch(`${suggestionsEndpoint ?? `${apiEndpoint}/suggestions`}?search=${search}`)
      .then((res) => res.json())
      .then((resData) => {
        setSuggestions(resData);
        setHasFetchedSuggestions(true);
      });
  }, [search, apiEndpoint, suggestionsEndpoint]);

  //update the url parameters
  const updateParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', 1);
        if (value) params.set(key, value);
        else params.delete(key);
        return params;
      });
    },
    [setSearchParams],
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div aria-live="polite" className="sr-only">
        {resultAnnouncement}
      </div>
      <BrowseListView
        currentPage={page}
        totalPages={pageCount}
        onPageChange={(newPage) => updateParam('page', newPage)}
        search={search}
        onSearchChange={(val) => updateParam('search', val)}
        onSortChange={(val) => val && updateParam('sort', val)}
        onStateChange={(val) => updateParam('state', val)}
        suggestions={suggestions}
        hasFetchedSuggestions={hasFetchedSuggestions}
        title={title}
        searchPlaceholder={searchPlaceholder}
        type={type}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        filterAccessibleLabel={filterAccessibleLabel}
        onFilterChange={onFilterChange}
        onSuggestionPick={onSuggestionPick}
      >
        {error ? (
          <>
            <ErrorBanner
              title="Failed to load"
              message="Listings couldn't be retrieved. Try refreshing the page."
            />
            <div className="pointer-events-none mt-4 opacity-60 select-none">
              <BrowseListSkeleton count={3} error />
            </div>
          </>
        ) : loading ? (
          <BrowseListSkeleton />
        ) : data.length > 0 ? (
          renderList(data)
        ) : (
          <NoResultsBanner term={search || state} />
        )}
      </BrowseListView>
    </div>
  );
}
