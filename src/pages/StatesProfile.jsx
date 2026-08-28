import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import LayoutPage from '../components/ui/atom/layout-page';
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
import { fetchNationalBenchmarks } from '../lib/nationalBenchmarks';

/**
 * State profile page container.
 *
 * Owns the three fetches the page runs off — the profile stats, the national
 * benchmarks the comparison badges read against, and the full facility list —
 * and routes each to the header, the tab shell, and the sections that need it.
 * All three are keyed on (state, year) from the route param and the header's
 * year selector, so changing either refetches everything.
 *
 * Shaping belongs to the src/lib builders and layout to the components; this
 * file only decides what is fetched and who receives it.
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
  const [stateFinancial, setStateFinancial] = useState(null);
  const [stateFacilitiesLoading, setStateFacilitiesLoading] = useState(true);
  const [stateFacilitiesError, setStateFacilitiesError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  const requestedYear = Number(searchParams.get('year'));
  const selectedYear = AVAILABLE_YEARS.includes(requestedYear)
    ? requestedYear
    : AVAILABLE_YEARS[0];

  const navigate = useNavigate();

  const handleYearChange = (year) => {
    const nextYear = Number(year);
    if (!AVAILABLE_YEARS.includes(nextYear)) return;

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('year', String(nextYear));
      return next;
    });
  };

  // Both routes key on an uppercase 2-letter code; the URL may carry either case.
  const stateCode = encodeURIComponent(String(stateParam ?? '').toUpperCase());

  /* Selecting a state routes to its profile; the fetch effect below is keyed on
     the route param, so the page refetches and re-renders automatically. */
  const handleStateChange = (nextState) => {
    if (nextState && nextState !== stateParam) {
      // Keep year and tab so comparing two states lands on the same view.
      navigate({
        pathname: `/nursing-homes/states/${nextState}`,
        search,
      });
    }
  };

  useEffect(() => {
    /* Every section that renders text: the header, State Highlights, and the two
       burden tables in Deficiencies. All keyed on (state, year) and all small, so
       one request rather than three. The facility list stays separate below — it
       is 7x the size of this, and merging would make the header wait on it. */
    const controller = new AbortController();
    setLoading(true);
    setStateStats(null);
    setError(null);
    setNotFound(false);

    fetch(
      `${API_BASE_URL}/state-profile/${stateCode}?year=${selectedYear}&take=500&minFacilities=2`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (!data) {
          setNotFound(true);
          return;
        }
        setStateStats(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Failed to load state data.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [stateCode, selectedYear]);

  useEffect(() => {
    /* National averages power the clinical-quality comparison badges; the
       state-profile endpoint covers this state only, so fetch them separately.
       Shared across profile pages, so the same year is only ever fetched once. */
    let active = true;
    setNationalBenchmarks(null);
    fetchNationalBenchmarks(selectedYear)
      .then((data) => {
        if (active) setNationalBenchmarks(data);
      })
      .catch((err) => console.error('Failed to fetch national averages:', err));

    return () => {
      active = false;
    };
  }, [selectedYear]);

  useEffect(() => {
    /* Full facility list for this state, powering the "Deficiencies by Facility"
       table and the Real Estate tab. The state-profile endpoint only returns a
       facility count, so fetch the rows separately and rank client-side.
       /state-facilities is uncapped and projects only the columns those two
       consumers read — the generic /facilities route embeds every ownership link
       with its full entity, which is 137MB for TX. Aborted on state change so a
       slow response can't paint the previous state's facilities. */
    const controller = new AbortController();
    setStateFacilities([]);
    setStateFinancial(null);
    setStateFacilitiesLoading(true);
    setStateFacilitiesError(null);
    const fetchStateFacilities = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/state-facilities/${stateCode}?year=${selectedYear}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error('Failed to load');
        const payload = await res.json();
        if (!controller.signal.aborted) {
          setStateFacilities(payload?.data ?? []);
          /* The year the operating margins actually came from. Cost reports are
             audited years in arrears, so they routinely predate the requested
             year and the map has to name the year it is coloring. */
          setStateFinancial(payload?.financial ?? null);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch state facilities:', err);
          setStateFacilitiesError(
            'State facility data could not be retrieved.',
          );
        }
      } finally {
        if (!controller.signal.aborted) setStateFacilitiesLoading(false);
      }
    };

    fetchStateFacilities();
    return () => controller.abort();
  }, [stateCode, selectedYear]);

  /* Header export set. Copy-link works generically today; state-specific CSV/zip
     exports are pending stateShareActions (see profile/stateShareActions.js). */
  const shareCategories = useMemo(() => [copyLinkShareCategory()], []);

  const breadcrumbPages = [
    { name: 'Home', to: '/nursing-homes', current: false },
    {
      name: stateParam ? expandStateAbbreviation(stateParam) : '...',
      to: `/nursing-homes/states/${stateParam}`,
      current: true,
    },
  ];

  return (
    <div className="bg-background-secondary pb-8 font-sans">
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
              subjectType="state"
              years={AVAILABLE_YEARS}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              stateOptions={US_STATES}
              onStateChange={handleStateChange}
              shareCategories={shareCategories}
            />

            {/* Shared tab shell; active tab content is chosen in the render function below. */}
            <TabsShell
              tabsData={stateTabsDescriptions}
              defaultTabName={'State Highlights'}
              urlParam="tab"
            >
              {(activeTab) => {
                switch (activeTab.name) {
                  case 'State Highlights':
                    return (
                      <ProviderHighlights
                        items={stateStats}
                        status="state"
                        nationalBenchmarks={nationalBenchmarks}
                        facilities={stateFacilities}
                        facilitiesFinancial={stateFinancial}
                        facilitiesLoading={stateFacilitiesLoading}
                        facilitiesError={stateFacilitiesError}
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
                        facilitiesError={stateFacilitiesError}
                        chains={stateStats.chain_burden ?? []}
                        individualOwners={stateStats.individual_burden ?? []}
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
                        error={stateFacilitiesError}
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

            {/* Ownership-changes CTA. Temporarily falls back to the component's
                live-feed demo default; restore the state-filtered `to` below to
                send users back to the native /acquisitions list. */}
            <StateAcquisitionsCta
              stateName={expandStateAbbreviation(stateStats.state)}
              changeCount={15}
              // to={`/nursing-homes/acquisitions?state=${encodeURIComponent(stateStats.state)}`}
            />
          </>
        )}
      </LayoutPage>
    </div>
  );
}
