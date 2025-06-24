import React, { useEffect, useState } from 'react';
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
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const searchFromURL = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchFromURL);
  const [suggestions, setSuggestions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams({
      page,
      take: 20,
    });

    if (search) params.set('search', search);

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
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`${API_BASE_URL}/facilities/suggestions?search=${search}`)
        .then((res) => res.json())
        .then((data) =>
          setSuggestions(data.map((d) => ({ id: d.id, label: d.name }))),
        );
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function handlePageChange(newPage) {
    setPage(newPage);
    setSearchParams({ page: newPage });
  }

  function handleSearchChange(newSearch) {
    setSearch(newSearch);
    setPage(1);
    setSearchParams({ page: 1, search: newSearch });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <BrowseListView
        currentPage={page}
        totalPages={pageCount}
        onPageChange={handlePageChange}
        search={search}
        onSearchChange={handleSearchChange}
        suggestions={suggestions}
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
