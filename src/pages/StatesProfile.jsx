import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';
import { ProfilePageSkeleton } from '../components/ui/atom/skeletons.jsx';
import { ErrorBanner } from '../components/ui/atom/errorBanner.jsx';
import ProfileHeader from '../components/ui/molecule/profileHeader.jsx';
import { expandStateAbbreviation } from '../lib/stringFormatters.js';

/**
 * State profile page container.
 *
 * Minimal scaffold: fetches per-state stats by route param and renders the
 * raw response so the endpoint wiring can be verified. Sections/tabs are meant
 * to be rebuilt from here.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

export default function StatesProfile() {
  const { state: stateParam } = useParams();
  const [stateStats, setStateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setStateStats(null);
    setError(null);
    setNotFound(false);

    fetch(`${API_BASE_URL}/state-stats/${encodeURIComponent(stateParam)}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setStateStats(data);
      })
      .catch(() => setError('Failed to load state data.'))
      .finally(() => setLoading(false));
  }, [stateParam]);

  const handleResearchClick = () => {
    // Placeholder for future research click behavior.
  };

  const breadcrumbPages = [
    { name: 'Home', to: '/', current: false },
    { name: stateParam || '...', to: `/states/${stateParam}`, current: true },
  ];

  return (
    <div className="bg-background-secondary font-sans">
      <Breadcrumb pages={breadcrumbPages} />
      <LayoutPage>
        {loading ? (
          <ProfilePageSkeleton />
        ) : error ? (
          <>
            <ErrorBanner
              title="Failed to load"
              message="State data couldn't be retrieved. Try refreshing the page."
            />
            <div className="pointer-events-none mt-4 opacity-60 select-none">
              <ProfilePageSkeleton error />
            </div>
          </>
        ) : notFound ? (
          <>
            <ErrorBanner
              title="State not found"
              message="We couldn't find a state matching this URL."
            />
            <div className="pointer-events-none mt-4 opacity-60 select-none">
              <ProfilePageSkeleton error />
            </div>
          </>
        ) : (
          <>
            <ProfileHeader
              title={expandStateAbbreviation(stateStats.state)}
              freshness={'Data as of March 25, 2026'}
              rank={stateStats.rank_overall_rating}
              outOf={stateStats.ranked_out_of}
              onClick={handleResearchClick}
              subjectType="state"
            />
          </>
        )}
      </LayoutPage>
    </div>
  );
}
