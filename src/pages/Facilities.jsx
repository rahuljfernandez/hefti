import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://app.hefti-data-api.lndo.site:8000/api';

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

  return (
    <div>
      <h1>Nursing Facilities</h1>
      <ul>
        {facilities.map((facility) => (
          <li key={facility.id}>
            <strong>{facility.name}</strong><br />
            {facility.address}, {facility.city}, {facility.state}<br />
            {facility.certification_date ? `Certified: ${new Date(facility.certification_date).toLocaleDateString()}` : 'Not Certified'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Facilities;