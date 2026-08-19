import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';
import { ProfilePageSkeleton } from '../components/ui/atom/skeletons.jsx';
import { ErrorBanner } from '../components/ui/atom/errorBanner.jsx';
import ProfileHeader from '../components/ui/molecule/profileHeader.jsx';
import { expandStateAbbreviation, US_STATES } from '../lib/stringFormatters.js';
import TabsShell from '../components/ui/molecule/tabsShell.jsx';
import { stateTabsDescriptions } from '../lib/tabDescriptions.js';
import ProviderHighlights from '../components/ui/organism/providerHighlights.jsx';
import StateAcquisitionsCta from '../components/ui/molecule/stateAcquisitionsCta.jsx';
import DeficienciesTab from '../components/ui/molecule/tabs/deficienciesTab';
import ClinicalQualityTab from '../components/ui/molecule/tabs/clinicalQualityTab';
import StaffingTab from '../components/ui/molecule/tabs/staffingTab';
import FinancialOverviewTab from '../components/ui/molecule/tabs/financialOverviewTab';
import StateRealEstateTab from '../components/ui/molecule/tabs/stateRealEstateTab';
import { copyLinkShareCategory } from '../lib/shareability/profile/profileShareActions';

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

// TODO: replace with years returned from the API once the endpoint supports year filtering.
const AVAILABLE_YEARS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
];

export default function StatesProfile() {
  const { state: stateParam } = useParams();
  const [stateStats, setStateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [nationalBenchmarks, setNationalBenchmarks] = useState(null);
  const [stateFacilities, setStateFacilities] = useState([]);
  const [stateFacilitiesLoading, setStateFacilitiesLoading] = useState(true);
  const [chainBurden, setChainBurden] = useState([]);
  const [individualBurden, setIndividualBurden] = useState([]);
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[0]);

  const navigate = useNavigate();

  /* Selecting a state routes to its profile; the fetch effect below is keyed on
     the route param, so the page refetches and re-renders automatically. */
  const handleStateChange = (nextState) => {
    if (nextState && nextState !== stateParam) {
      navigate(`/states/${nextState}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    setStateStats(null);
    setError(null);
    setNotFound(false);

    fetch(`${API_BASE_URL}/state-stats/${encodeURIComponent(stateParam)}?year=${selectedYear}`)
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
  }, [stateParam, selectedYear]);

  useEffect(() => {
    /* National averages power the clinical-quality comparison badges; the
       state-stats endpoint doesn't include them, so fetch them separately. */
    const fetchNationalBenchmarks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/national?year=${selectedYear}`);
        const data = await res.json();
        setNationalBenchmarks(data);
      } catch (err) {
        console.error('Failed to fetch national averages:', err);
      }
    };

    fetchNationalBenchmarks();
  }, [selectedYear]);

  useEffect(() => {
    /* Full facility list for this state, powering the "Deficiencies by Facility"
       table (and a future page-level export). The state-stats endpoint only
       returns a facility count, so fetch the rows separately and rank client-
       side. take=1500 covers every current state (largest ~1200); a state
       exceeding it would truncate the ranking — a server-side deficiency sort is
       tracked in HEF-157. Aborted on state change so a slow response can't paint
       the previous state's facilities. */
    const controller = new AbortController();
    setStateFacilities([]);
    setStateFacilitiesLoading(true);
    const fetchStateFacilities = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/facilities?state=${encodeURIComponent(
            stateParam.toUpperCase(),
          )}&year=${selectedYear}&take=1500`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setStateFacilities(data?.data ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch state facilities:', err);
        }
      } finally {
        if (!controller.signal.aborted) setStateFacilitiesLoading(false);
      }
    };

    fetchStateFacilities();
    return () => controller.abort();
  }, [stateParam, selectedYear]);

  useEffect(() => {
    /* Chains and individual owners operating in this state, each ranked by
       average deficiency burden. Server-ranked and capped; chains group by
       chain_name (so holding-company shells collapse), individuals by owner. */
    const controller = new AbortController();
    setChainBurden([]);
    setIndividualBurden([]);
    const code = encodeURIComponent(stateParam.toUpperCase());
    const loadBurden = async (path, set, label) => {
      try {
        // Fetch the full qualifying set (small per state) so the tables can
        // expand in place instead of linking out. minFacilities=2 includes
        // smaller two-facility operators.
        const res = await fetch(
          `${API_BASE_URL}/${path}/${code}?take=500&minFacilities=2`,
          { signal: controller.signal },
        );
        const data = await res.json();
        set(data?.data ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(`Failed to fetch ${label}:`, err);
        }
      }
    };

    loadBurden('state-chain-burden', setChainBurden, 'state chain burden');
    loadBurden(
      'state-individual-burden',
      setIndividualBurden,
      'state individual burden',
    );
    return () => controller.abort();
  }, [stateParam]);

  const handleResearchClick = () => {
    // Placeholder for future research click behavior.
  };

  /* Header export set. Copy-link works generically today; state-specific CSV/zip
     exports are pending stateShareActions (see profile/stateShareActions.js). */
  const shareCategories = useMemo(() => [copyLinkShareCategory()], []);

  const breadcrumbPages = [
    { name: 'Home', to: '/', current: false },
    {
      name: stateParam ? expandStateAbbreviation(stateParam) : '...',
      to: `/states/${stateParam}`,
      current: true,
    },
  ];

  return (
    <div className="bg-background-secondary font-sans pb-8">
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
              years={AVAILABLE_YEARS}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              stateOptions={US_STATES}
              onStateChange={handleStateChange}
              shareCategories={shareCategories}
            />

            {/* Shared tab shell; active tab content is chosen in the render function below. */}
            <TabsShell
              tabsData={stateTabsDescriptions}
              defaultTabName={'State Highlights'}
            >
              {(activeTab) => {
                switch (activeTab.name) {
                  case 'State Highlights':
                    return (
                      <ProviderHighlights
                        items={stateStats}
                        status="state"
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );
                  //As of 3/16/26 we are holding off on deficiencies
                  //4/17 Tyler requested tab be visible with coming soon
                  case 'Deficiencies & Penalties':
                    return (
                      <DeficienciesTab
                        metricsSource={stateStats}
                        status="state"
                        nationalBenchmarks={nationalBenchmarks}
                        facilities={stateFacilities}
                        chains={chainBurden}
                        individualOwners={individualBurden}
                      />
                    );

                  case 'Clinical Quality Measures':
                    return (
                      <ClinicalQualityTab
                        metricsSource={stateStats}
                        status={'state'}
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Staffing':
                    return (
                      <StaffingTab
                        items={stateStats}
                        status={'state'}
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Financial Overview':
                    return (
                      <FinancialOverviewTab
                        items={stateStats}
                        status={'state'}
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Real Estate':
                    return (
                      <StateRealEstateTab
                        facilities={stateFacilities}
                        loading={stateFacilitiesLoading}
                        stateAbbr={stateStats?.state}
                        year={selectedYear}
                      />
                    );

                  default:
                    return (
                      <p className="text-muted-foreground text-sm">
                        This section is under development.
                      </p>
                    );
                }
              }}
            </TabsShell>

            {/* Ownership-changes CTA → native /acquisitions list (state-filtered). */}
            <StateAcquisitionsCta
              stateName={expandStateAbbreviation(stateStats.state)}
              changeCount={15}
              to={`/acquisitions?state=${encodeURIComponent(stateStats.state)}`}
            />
          </>
        )}
      </LayoutPage>
    </div>
  );
}
