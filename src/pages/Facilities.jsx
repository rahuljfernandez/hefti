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
  const [facilities, setFacilities] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      page,
      take: 20,
    });
    fetch(`${API_BASE_URL}/facilities?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch facilities');
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setFacilities(data.data);
        setPageCount(data.pageCount);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function handlePageChange(newPage) {
    setPage(newPage);
    setSearchParams({ page: newPage });
  }

  return (
    <div className="bg-gray-100">
      <BrowseListView
        currentPage={page}
        totalPages={pageCount}
        onPageChange={handlePageChange}
        title="Nursing Homes"
        searchPlaceholder="Nursing Home name..."
      >
        <ListContainer
          items={facilities}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseNursingHomes}
        />
      </BrowseListView>
    </div>
  );
}

export default Facilities;
