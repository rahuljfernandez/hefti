import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowseListView from '../components/ui/organism/browseListView';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

function Facilities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  // const [page, setPage] = useState(pageFromUrl);
  const search = searchParams.get('search') || '';
  // const [search, setSearch] = useState(searchFromURL);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams({
      page,
    });

    //  Only add search if it's non-empty
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
  }, [page, search]);

  //This is for the search suggestion dropdown
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

  function handlePageChange(newPage) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage);
      return params;
    });
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <BrowseListView
        currentPage={page}
        totalPages={pageCount}
        onPageChange={handlePageChange}
        search={search}
        onSearchChange={handleSearchChange}
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
          <p className="text-paragraph-base text-core-black mt-4 text-center">
            <span className="font-bold">&quot;{search}&quot; </span>did not
            return any results.
          </p>
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
