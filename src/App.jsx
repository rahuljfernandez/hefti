import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

function App() {
  const [facilities, setFacilities] = useState([]);
  const [stateFilter, setStateFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  const getFacilities = React.useCallback(async () => {
    // use .limit to avoid fetching all 144k rows
    let query = supabase.from('facilities').select('*').limit(100);

    if (stateFilter) {
      query = query.ilike('State', `%${stateFilter}%`);
    }

    if (ownerFilter) {
      query = query.ilike('CMS_Ownership_Name', `%${ownerFilter}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data);
    }
  }, [stateFilter, ownerFilter]);

  useEffect(() => {
    getFacilities();
  }, [getFacilities]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Search Facilities</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Filter by State (e.g., VA)"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Filter by Owner"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="border p-2"
        />
      </div>

      <ul className="list-disc pl-5">
        {facilities.map((f, index) => (
          <li key={f.CCN + index}>
            {f.Name} — {f.City}, {f.State} ({f['CMS_Ownership_Name']})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
