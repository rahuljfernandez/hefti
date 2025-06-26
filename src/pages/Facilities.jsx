import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowseListView from '../components/ui/organism/browseListView';

/**
 * Main page for browsing nursing home facilities.  Inlcudes search, sort, filter, pagination, and suggestion logic.
 * This component is the single source of truth for all browse nursing home api data.  Data is prop drilled down to children components to render the ui.
 * Uses BrowseListView component to provide title/search/pagination. BrowseListView also recieves a ListContainer child that rquires the facilities data to display LI's
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

function Facilities() {
  // --- URL Params ---
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'asc';
  const filter = searchParams.get('filter') || '';
  // --- UI State ---
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch facility data when page, serach, sort or filter changes
  useEffect(() => {
    const params = new URLSearchParams({
      page,
      sort,
      filter,
    });

    //  Only add search if it's not empty
    if (search.trim() !== '') {
      params.set('search', search);
    }

    fetch(`${API_BASE_URL}/facilities?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch facilities');
        return res.json();
      })
      .then((data) => {
        setFacilities(data.data);
        setPageCount(data.pageCount);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page, search, sort, filter]);

  //Fetch suggestions when user types in the search box
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setHasFetchedSuggestions(false);
      return;
    }

    fetch(`${API_BASE_URL}/facilities/suggestions?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.map((d) => ({ id: d.id, label: d.name })));
        setHasFetchedSuggestions(true);
      });
  }, [search]);

  //update URL param when pagination changes
  function handlePageChange(newPage) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage);
      return params;
    });
  }

  //Update search query in URL and reset to page 1 if different
  const handleSearchChange = useCallback(
    (newSearch) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        const prevSearch = params.get('search') || '';

        // Only reset page if the search term actually changed
        if (prevSearch !== newSearch) {
          params.set('page', 1);
        }

        if (newSearch.trim() !== '') {
          params.set('search', newSearch);
        } else {
          params.delete('search');
        }
        return params;
      });
    },
    [setSearchParams],
  );

  //Update sort query in URL
  const handleSortChange = useCallback(
    (newSort) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', 1);
        if (newSort) {
          params.set('sort', newSort);
        } else {
          params.delete('sort');
        }
        return params;
      });
    },
    [setSearchParams],
  );

  //Update filter query in URL
  const handleFilterChange = useCallback(
    (newFilter) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', 1);

        if (newFilter) {
          params.set('filter', newFilter);
        } else {
          params.delete('filter');
        }

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
        onPageChange={handlePageChange}
        search={search}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        suggestions={suggestions}
        hasFetchedSuggestions={hasFetchedSuggestions}
        title="Nursing Homes"
        searchPlaceholder="Nursing Home name..."
      >
        {facilities.length > 0 ? (
          <ListContainer
            items={facilities}
            LayoutSelector={ListContainerSeparate}
            ListContent={BrowseNursingHomes}
          />
        ) : (
          facilities.length === 0 &&
          !loading && (
            <p className="text-paragraph-base text-core-black mt-4 text-center">
              <span className="font-bold">&quot;{search || filter}&quot; </span>
              did not return any results.
            </p>
          )
        )}
        {loading && (
          <p className="text-sm text-gray-500">Loading new page...</p>
        )}
        {error && <p>Error: {error.message}</p>}
      </BrowseListView>
    </div>
  );
}

export default Facilities;
