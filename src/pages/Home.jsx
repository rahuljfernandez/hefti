import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/atom/button';
import { Heading } from '../components/ui/atom/heading';
import { Divider } from '../components/ui/atom/divider';
// import your icon components if available

export default function Home() {
  const [topChains, setTopChains] = useState([]);
  const [topOwners, setTopOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  console.log('API_BASE_URL:', API_BASE_URL);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/top-chains`).then(res => res.json()),
      fetch(`${API_BASE_URL}/top-owners`).then(res => res.json()),
    ])
      .then(([chains, owners]) => {
        setTopChains(chains);
        setTopOwners(owners);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load industry data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-core-black text-white px-6 py-3 flex justify-between items-center">
        <div className="font-bold">HEFTI</div>
        <nav>
          <Link to="/about" className="mr-4">About</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-12">
        <Heading level={1} className="text-center mb-4">
          Powering better oversight through clearer nursing home data
        </Heading>
        <p className="text-center mb-8 text-lg">
          Access the latest insights on care quality, ownership, and operations to support informed decisions and stronger accountability.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center">
            {/* Icon can go here */}
            <Heading level={3} className="mb-2">Nursing Homes</Heading>
            <ul className="mb-4 text-center text-sm text-gray-600">
              <li>See full list of nursing homes</li>
              <li>View nursing home profile pages</li>
            </ul>
            <Link to="/facilities">
              <Button>Browse Nursing Homes</Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex-1 flex flex-col items-center">
            {/* Icon can go here */}
            <Heading level={3} className="mb-2">Owners</Heading>
            <ul className="mb-4 text-center text-sm text-gray-600">
              <li>See full list of nursing home owners</li>
              <li>View profile pages for owners</li>
            </ul>
            <Link to="/owners">
              <Button>Browse Owners</Button>
            </Link>
          </div>
        </div>

        <Divider className="my-8" />

        <Heading level={2} className="text-center mb-6">
          State of the Nursing Home Industry
        </Heading>
        {loading ? (
          <p className="text-center text-gray-500">Loading industry data...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Heading level={4} className="mb-2">Top 10 Largest Chains</Heading>
              <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
                {topChains.map((chain) => (
                  <li key={chain.name} className="flex justify-between px-4 py-2">
                    <span className="text-blue-700 underline">{chain.name}</span>
                    <span className="text-gray-700">{chain.count} facilities</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Heading level={4} className="mb-2">Top 10 Largest Individual Owners</Heading>
              <ul className="bg-white rounded-xl shadow divide-y divide-gray-200">
                {topOwners.map((owner) => (
                  <li key={owner.name} className="flex justify-between px-4 py-2">
                    <span className="text-purple-700 underline">{owner.name}</span>
                    <span className="text-gray-700">{owner.count} facilities</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
