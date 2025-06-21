import React, { useEffect, useState } from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseNursingHomes } from '../components/ui/molecule/listContainerContent';
import BrowseListView from '../components/ui/organism/browseListView';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/facilities`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch facilities');
        return res.json();
      })
      .then(setFacilities)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(facilities);

  return (
    <div className="bg-gray-100">
      <BrowseListView
        title="Nursing Homes"
        searchPlaceholder="Nursing Home name..."
      >
        <ListContainer
          items={facilities.data}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseNursingHomes}
        />
      </BrowseListView>
    </div>
  );
}

export default Facilities;
