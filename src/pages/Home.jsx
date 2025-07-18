import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/atom/button';
import { Heading } from '../components/ui/atom/heading';
import { slugify } from '../lib/slugify';
import { toTitleCase } from '../lib/toTitleCase';
import OfficeBuildingCircle from '../assets/officeBuildingCircle.jsx';
import UserGroupCircle from '../assets/userGroupCircle.jsx';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

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

  // bg-[radial-gradient(circle_at_top_left,_#BFDBFE_15%,_#EFF6FF_25%)] 2xl:bg-[radial-gradient(circle_at_top_left,_#BFDBFE_18%,_#EFF6FF_30%)]
  return (
    <div className="relative min-h-screen w-full overflow-hidden border bg-[#3B82F60D]">
      <div className="absolute top-90 -left-10 z-0 h-[400px] w-[400px] -translate-y-[100%] rounded-full bg-blue-400 blur-[170px] 2xl:h-[500px] 2xl:w-[500px]" />
      {/* Top (hero + cards) section with gradient background */}
      <section className="relative mx-auto max-w-[960px] px-4 py-8 font-sans sm:px-6 lg:px-8 xl:px-0">
        <div className="absolute top-1/2 right-0 z-0 h-[300px] w-[300px] -translate-y-[10%] rounded-full bg-purple-900 blur-[250px] 2xl:-right-20" />
        <div className="mx-auto max-w-[940px] text-center">
          <Heading level={1} className="text-display-xs mb-4">
            Powering better oversight through clearer nursing home data
          </Heading>
          <p className="text-heading-sm mb-8 font-normal">
            Access the latest insights on care quality, ownership, and
            operations to support informed decisions and stronger
            accountability.
          </p>
        </div>

        <div className="relative z-10 mb-12 flex flex-col justify-center gap-6 md:flex-row">
          <div className="border-content-tertiary flex flex-1 flex-col items-center rounded-xl border bg-[radial-gradient(circle_at_top_right,_#BFDBFE_20%,_#EFF6FF_50%)] p-5 shadow-sm">
            <OfficeBuildingCircle className="mb-3 h-16 w-16" />
            <Heading level={3} className="text-heading-sm mb-2">
              Nursing Homes
            </Heading>
            <ul className="text-content-tertiary text-paragraph-base mb-4">
              <li className="flex items-center justify-center gap-2">
                <span className="bg-content-tertiary h-1.5 w-1.5 rounded-full"></span>
                <span>See full list of nursing homes</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="bg-content-tertiary h-1.5 w-1.5 rounded-full"></span>
                <span>View nursing home profile pages</span>
              </li>
            </ul>
            <Link to="/facilities" className="w-full">
              <Button
                color="darkZincOutline"
                className="text-label-base w-full rounded-lg py-3 font-semibold"
              >
                Browse Nursing Homes
              </Button>
            </Link>
          </div>
          <div className="border-content-tertiary flex flex-1 flex-col items-center rounded-xl border bg-[radial-gradient(circle_at_top_right,_#E9D5FF_20%,_#FAF5FF_60%)] p-5 shadow-sm">
            <UserGroupCircle className="mb-3 h-16 w-16" />
            <Heading level={3} className="text-heading-sm mb-2">
              Owners
            </Heading>
            <ul className="text-content-tertiary text-paragraph-base mb-4">
              <li className="flex items-center justify-center gap-2">
                <span className="bg-content-tertiary h-1.5 w-1.5 rounded-full"></span>
                <span>See full list of nursing home owners</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="bg-content-tertiary h-1.5 w-1.5 rounded-full"></span>
                <span>View profile pages for owners</span>
              </li>
            </ul>
            <Link to="/owners" className="w-full">
              <Button
                color="darkZincOutline"
                className="text-label-base w-full rounded-lg py-3 font-semibold"
              >
                Browse Owners
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom (lists) section with gray background */}
      <section className="bg-background-secondary min-h-[400px] w-full px-4 py-8 pb-16 font-sans sm:px-6 lg:px-8 xl:px-0">
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
                <Heading level={3} className="mb-4">
                  Top 10 Largest Chains
                </Heading>
                <ul className="divide-y divide-gray-200 rounded-xl border border-l-2 border-gray-200 bg-white/80 shadow-[0_1px_6px_0_rgba(59,130,246,0.07)]">
                  {topChains.map((chain) => (
                    <li key={chain.name}>
                      <Link
                        to={`/facilities?chain=${encodeURIComponent(slugify(chain.name))}`}
                        className="flex items-center justify-between px-6 py-6 transition-colors hover:bg-blue-50/40 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        style={{ textDecoration: 'none' }}
                      >
                        <span className="text-paragraph-base font-bold text-blue-700 underline">
                          {toTitleCase(chain.name)}
                        </span>
                        <span className="text-paragraph-base text-core-black min-w-[80px] text-right">
                          {chain.count} facilities
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Heading level={3} className="mb-4">
                  Top 10 Largest Individual Owners
                </Heading>
                <ul className="divide-y divide-gray-200 rounded-xl border border-l-2 border-gray-200 bg-white/80 shadow-[0_1px_6px_0_rgba(168,85,247,0.07)]">
                  {topOwners.map((owner) => (
                    <Link
                      key={owner.name}
                      to={
                        owner.slug
                          ? `/owners/${owner.slug}`
                          : `/owners/${slugify(owner.name)}`
                      }
                      className="flex items-center justify-between px-6 py-6 transition-colors hover:bg-purple-50/40 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="text-paragraph-base font-bold text-blue-700 underline">
                        {toTitleCase(owner.name)}
                      </span>
                      <span className="text-paragraph-base text-core-black min-w-[80px] text-right">
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
