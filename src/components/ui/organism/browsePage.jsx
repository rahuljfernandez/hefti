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
 * It receives props from Owners or Facilities pages to customize:
 * API endpoints
 * Display titles
 * Search placeholders
 * Routing behavior
 */

BrowsePage.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  renderList: PropTypes.func.isRequired,
  mapSuggestions: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['facilities', 'owners']),
};

export default function BrowsePage({
  apiEndpoint,
  title,
  searchPlaceholder,
  renderList,
  type,
}) {
  // // --- URL Params ---
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';
  const state = searchParams.get('state') || '';
  const chain = searchParams.get('chain') || '';
  // // --- UI State ---
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetch(`${apiEndpoint}/suggestions?search=${search}`)
      .then((res) => res.json())
      .then((resData) => {
        setSuggestions(resData);
        setHasFetchedSuggestions(true);
      });
  }, [search, apiEndpoint]);

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
      <BrowseListView
        currentPage={page}
        totalPages={pageCount}
        onPageChange={(newPage) => updateParam('page', newPage)}
        search={search}
        onSearchChange={(val) => updateParam('search', val)}
        onSortChange={(val) => updateParam('sort', val)}
        onStateChange={(val) => updateParam('state', val)}
        suggestions={suggestions}
        hasFetchedSuggestions={hasFetchedSuggestions}
        title={title}
        searchPlaceholder={searchPlaceholder}
        type={type}
      >
        {error ? (
          <>
            <ErrorBanner
              title="Failed to load"
              message="Listings couldn't be retrieved. Try refreshing the page."
            />
            <div className="pointer-events-none select-none opacity-60 mt-4">
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
