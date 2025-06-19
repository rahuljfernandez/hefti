import React, { useEffect, useState } from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../components/ui/organism/ListContainer';
import { BrowseOwners } from '../components/ui/molecule/listContainerContent';
import BrowseListView from '../components/ui/organism/browseListView';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://app.hefti-data-api.lndo.site:8000/api';

function Owners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/owners`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch Owners');
        return res.json();
      })
      .then(setOwners)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading owners...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(owners);

  return (
    <div className="bg-gray-100">
      <BrowseListView title="Owners / Affiliated Entities">
        <ListContainer
          items={owners}
          LayoutSelector={ListContainerSeparate}
          ListContent={BrowseOwners}
        />
      </BrowseListView>
    </div>
  );
}

export default Owners;
