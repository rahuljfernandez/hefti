import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/atom/button';
import { Heading } from '../components/ui/atom/heading';
import { Divider } from '../components/ui/atom/divider';
import { slugify } from '../lib/slugify';
import { toTitleCase } from '../lib/toTitleCase';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
// import your icon components if available

export default function Home() {
  const [topChains, setTopChains] = useState([]);
  const [topOwners, setTopOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  console.log('API_BASE_URL:', API_BASE_URL);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/top-chains`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/top-owners`).then((res) => res.json()),
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa]">
      {/* Top (hero + cards) section with gradient background */}
      <section className="mx-auto max-w-3xl py-8 font-sans">
        <Heading level={1} className="text-display-xs mb-4 text-center">
          Powering better oversight through clearer nursing home data
        </Heading>
        <p className="text-heading-sm mb-8 text-center font-normal">
          Access the latest insights on care quality, ownership, and operations
          to support informed decisions and stronger accountability.
        </p>

        <div className="mb-12 flex flex-col justify-center gap-6 md:flex-row">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-md">
            <BuildingOffice2Icon className="mb-3 h-10 w-10 text-blue-400" />
            <Heading level={3} className="text-heading-sm mb-2">
              Nursing Homes
            </Heading>
            <ul className="mb-4 text-center text-sm text-blue-900/80">
              <li>See full list of nursing homes</li>
              <li>View nursing home profile pages</li>
            </ul>
            <Link to="/facilities" className="w-full">
              <Button className="w-full rounded-lg py-3 text-base font-bold">
                Browse Nursing Homes
              </Button>
            </Link>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-md">
            <UserGroupIcon className="mb-3 h-10 w-10 text-purple-400" />
            <Heading level={3} className="text-heading-sm mb-2">
              Owners
            </Heading>
            <ul className="mb-4 text-center text-sm text-purple-900/80">
              <li>See full list of nursing home owners</li>
              <li>View profile pages for owners</li>
            </ul>
            <Link to="/owners" className="w-full">
              <Button className="w-full rounded-lg py-3 text-base font-bold">
                Browse Owners
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom (lists) section with gray background */}
      <section className="bg-background-secondary min-h-[400px] w-full py-8 pb-16 font-sans">
        <div className="mx-auto max-w-5xl">
          <Heading level={2} className="text-heading-lg my-6 text-center">
            State of the Nursing Home Industry
          </Heading>
          {loading ? (
            <p className="text-center text-gray-500">
              Loading industry data...
            </p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
              <div>
                <Heading level={3} className="mb-2">
                  Top 10 Largest Chains
                </Heading>
                <ul className="divide-y divide-gray-200 rounded-2xl border border-l-2 border-blue-200 border-gray-200 bg-white/80 shadow-[0_1px_6px_0_rgba(59,130,246,0.07)]">
                  {topChains.map((chain) => (
                    <Link
                      key={chain.name}
                      to={`/facilities?chain=${encodeURIComponent(slugify(chain.name))}`}
                      className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-blue-50/40 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="text-base font-medium">
                        {toTitleCase(chain.name)}
                      </span>
                      <span className="min-w-[80px] text-right font-semibold text-gray-400">
                        {chain.count} facilities
                      </span>
                    </Link>
                  ))}
                </ul>
              </div>
              <div>
                <Heading level={3} className="mb-2">
                  Top 10 Largest Individual Owners
                </Heading>
                <ul className="divide-y divide-gray-200 rounded-2xl border border-l-2 border-gray-200 border-purple-200 bg-white/80 shadow-[0_1px_6px_0_rgba(168,85,247,0.07)]">
                  {topOwners.map((owner) => (
                    <Link
                      key={owner.name}
                      to={
                        owner.slug
                          ? `/owners/${owner.slug}`
                          : `/owners/${slugify(owner.name)}`
                      }
                      className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-purple-50/40 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="text-base font-medium">
                        {toTitleCase(owner.name)}
                      </span>
                      <span className="min-w-[80px] text-right font-semibold text-gray-400">
                        {owner.count} facilities
                      </span>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
