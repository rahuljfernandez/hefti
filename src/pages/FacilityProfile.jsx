import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import ProfileHeader from '../components/ui/molecule/profileHeader';

import Breadcrumb from '../components/ui/molecule/breadcrumb';
import {
  getFacilityProfilePages,
  getRankingsFacilityProfilePages,
} from '../lib/breadcrumbPages';

import { getBadgeColorOwnershipType } from '../lib/getBadgeColor';

import { facilityTabsDescriptions } from '../lib/tabDescriptions';
import TabsShell from '../components/ui/molecule/tabsShell';
import ProviderHighlights from '../components/ui/organism/providerHighlights';
import DeficienciesTab from '../components/ui/molecule/tabs/deficienciesTab';
import ClinicalQualityTab from '../components/ui/molecule/tabs/clinicalQualityTab';
import StaffingTab from '../components/ui/molecule/tabs/staffingTab';
import FinancialOverviewTab from '../components/ui/molecule/tabs/financialOverviewTab';
import FacilityRealEstateTab from '../components/ui/molecule/tabs/facilityRealEstateTab';
import { Heading } from '../components/ui/atom/heading';
import { ProfilePageSkeleton } from '../components/ui/atom/skeletons.jsx';
import { ErrorBanner } from '../components/ui/atom/errorBanner.jsx';
import ListContainer, {
  ListContainerDivider,
} from '../components/ui/organism/ListContainer';
import OwnershipFlowDiagram from '../components/ui/organism/ownershipFlowDiagram';
import { OwnershipAndStakeholders } from '../components/ui/molecule/listContainerContent';
import AdditionalInformation from '../components/ui/molecule/additionalInformation';
import {
  ShareButton,
  ShareButtonRow,
  HoverReveal,
} from '../components/ui/molecule/shareability';
import { TableCellsIcon, PhotoIcon } from '@heroicons/react/24/outline';
import {
  downloadProfileCsv,
  copyLinkShareCategory,
  csvShareCategory,
} from '../lib/shareability/profile/profileShareActions';
import {
  facilityStatsExportConfig,
  facilityStakeholdersExportConfig,
  buildFacilityStatsRows,
  downloadDiagramPng,
  facilityZipShareCategory,
} from '../lib/shareability/profile/facilityShareActions';
import { fetchNationalBenchmarks } from '../lib/nationalBenchmarks';

/**
 * FacilityProfile
 *
 * Route container for a single nursing-home facility (/nursing-homes/facilities/:slug). Fetches
 * the facility by slug (re-fetching when the selected data year changes) plus the
 * national benchmarks the tab comparisons use, then renders:
 *
 * - a ProfileHeader carrying the data-year selector and the export share widget
 *   (copy link, full-stats CSV, and a ZIP bundling stats + stakeholders + the
 *   ownership-diagram PNG);
 * - the tabbed sections (Provider Highlights, Deficiencies & Penalties, Clinical
 *   Quality, Staffing, Financial Overview, and Real Estate for supported
 *   data years);
 * - the Ownership & Stakeholders list and the Ownership Diagram, each with a
 *   hover-reveal local export (CSV and PNG respectively);
 * - an Additional Information metadata panel.
 *
 * Loading, error, and not-found states each render a skeleton/banner in place of
 * the body.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

// TODO: replace this hard-coded list when the API exposes available data years.
const AVAILABLE_YEARS = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010,
];

export default function FacilityProfile() {
  const { slug } = useParams();
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [nationalBenchmarks, setNationalBenchmarks] = useState(null);
  const requestedYear = Number(searchParams.get('year'));
  const selectedYear = AVAILABLE_YEARS.includes(requestedYear)
    ? requestedYear
    : AVAILABLE_YEARS[0];

  const navigate = useNavigate();

  const handleYearChange = (year) => {
    const nextYear = Number(year);
    if (!AVAILABLE_YEARS.includes(nextYear)) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('year', String(nextYear));
        return next;
      },
      { state },
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    // Reload facility details whenever the URL slug or selected year changes.
    setLoading(true);
    setFacility(null);
    setError(null);
    setNotFound(false);

    fetch(`${API_BASE_URL}/facilities/${slug}?year=${selectedYear}`, {
      signal: controller.signal,
    })
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
        setFacility(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Failed to load facility data.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [slug, selectedYear]);

  // Names (and therefore slugs) change across years; keep the URL on the
  // slug for the year we actually loaded.
  useEffect(() => {
    if (!facility?.slug || facility.slug === slug) return;
    if (Number(facility.year) !== selectedYear) return;

    const next = new URLSearchParams(searchParams);
    next.set('year', String(selectedYear));
    navigate(
      {
        pathname: `/nursing-homes/facilities/${encodeURIComponent(facility.slug)}`,
        search: `?${next.toString()}`,
      },
      { replace: true, state },
    );
  }, [facility, slug, selectedYear, searchParams, navigate, state]);

  //Fetch national benchmarks to compare faclity to national levels
  useEffect(() => {
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

  // Relationship records used for stakeholders + ownership diagram sections.
  const ownershipLinks = useMemo(
    () => facility?.facility_ownership_links || [],
    [facility],
  );

  // Flattened facility statistics powering the profile header's exports.
  const facilityStatsRows = useMemo(
    () => buildFacilityStatsRows(facility, nationalBenchmarks),
    [facility, nationalBenchmarks],
  );

  // Ref to the ownership diagram so its PNG can be exported (local + in the zip).
  const diagramRef = useRef(null);

  /* Header export set: copy link, the full stats CSV, and a zip bundling the
     stats, ownership/stakeholders, and the diagram PNG. */
  const shareCategories = useMemo(
    () => [
      copyLinkShareCategory(),
      csvShareCategory(
        facilityStatsRows,
        facilityStatsExportConfig,
        `${slug}.csv`,
      ),
      facilityZipShareCategory({
        statsRows: facilityStatsRows,
        stakeholderRows: ownershipLinks,
        diagramRef,
        filename: `${slug}.zip`,
      }),
    ],
    [facilityStatsRows, ownershipLinks, slug],
  );

  //click handler to open the AI chat
  const handleResearchClick = () => {
    navigate(
      `/nursing-homes/facilities/${slug}/research`,
      state?.from === 'rankings' ? { state: { from: 'rankings' } } : undefined,
    );
  };

  // Builds breadcrumb trail; swaps in rankings context when arriving from the rankings page.
  const breadcrumbPages =
    state?.from === 'rankings'
      ? getRankingsFacilityProfilePages(slug, facility?.provider_name)
      : getFacilityProfilePages(slug, facility?.provider_name);

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
              message="Facility data couldn't be retrieved. Try refreshing the page."
            />
            <div className="pointer-events-none mt-4 opacity-60 select-none">
              <ProfilePageSkeleton error />
            </div>
          </>
        ) : notFound ? (
          <>
            <ErrorBanner
              title="Facility not found"
              message="We couldn't find a facility matching this URL."
            />
            <div className="pointer-events-none mt-4 opacity-60 select-none">
              <ProfilePageSkeleton error />
            </div>
          </>
        ) : (
          <>
            <ProfileHeader
              title={facility.provider_name}
              ownershipType={facility.ownership_type}
              freshness={facility.data_freshness}
              func={getBadgeColorOwnershipType}
              onClick={handleResearchClick}
              subjectType="facility"
              years={AVAILABLE_YEARS}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              shareCategories={shareCategories}
            />
            {/* Shared tab shell; active tab content is chosen in the render function below. */}
            <TabsShell
              tabsData={facilityTabsDescriptions}
              defaultTabName={'Provider Highlights'}
            >
              {(activeTab) => {
                switch (activeTab.name) {
                  case 'Provider Highlights':
                    return (
                      <ProviderHighlights items={facility} status="facility" />
                    );
                  case 'Deficiencies & Penalties':
                    return (
                      <DeficienciesTab
                        metricsSource={facility}
                        status="facility"
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Clinical Quality Measures':
                    return (
                      <ClinicalQualityTab
                        metricsSource={facility}
                        status={'facility'}
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Staffing':
                    return <StaffingTab items={facility} status={'facility'} />;

                  case 'Financial Overview':
                    return (
                      <FinancialOverviewTab
                        items={facility}
                        status={'facility'}
                        nationalBenchmarks={nationalBenchmarks}
                      />
                    );

                  case 'Real Estate':
                    return (
                      <FacilityRealEstateTab
                        items={facility}
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

            {/* Ownership details are shown only when linked ownership records exist. */}
            {ownershipLinks.length > 0 && (
              <>
                {/* group enables the hover-reveal local CSV button on this section. */}
                <div className="group">
                  <div className="mt-8 mb-4 flex items-center gap-3">
                    <Heading level={3} className="text-heading-sm font-bold">
                      Ownership and Stakeholders
                    </Heading>
                    <HoverReveal>
                      <ShareButtonRow>
                        <ShareButton
                          icon={TableCellsIcon}
                          label="Download CSV"
                          onClick={() =>
                            downloadProfileCsv(
                              ownershipLinks,
                              facilityStakeholdersExportConfig,
                              `${slug}-ownership-stakeholders.csv`,
                            )
                          }
                        />
                      </ShareButtonRow>
                    </HoverReveal>
                  </div>
                  <ListContainer
                    items={ownershipLinks}
                    LayoutSelector={ListContainerDivider}
                    ListContent={OwnershipAndStakeholders}
                  />
                </div>

                {/* group enables the hover-reveal local PNG button on the diagram. */}
                <div className="group">
                  <div className="mt-8 mb-4 flex items-center gap-3">
                    <Heading level={3} className="text-heading-sm font-bold">
                      Ownership Diagram
                    </Heading>
                    <HoverReveal>
                      <ShareButtonRow>
                        <ShareButton
                          icon={PhotoIcon}
                          label="Download PNG"
                          onClick={() =>
                            downloadDiagramPng(
                              diagramRef.current,
                              `${slug}-ownership-diagram.png`,
                            )
                          }
                        />
                      </ShareButtonRow>
                    </HoverReveal>
                  </div>
                  <div ref={diagramRef} className="pb-8">
                    <OwnershipFlowDiagram
                      items={ownershipLinks}
                      facility={facility}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Bottom metadata panel for facility-level additional fields. */}
            <div className={ownershipLinks.length > 0 ? 'pb-8' : 'pt-8 pb-8'}>
              <AdditionalInformation items={facility} />
            </div>
          </>
        )}
      </LayoutPage>
    </div>
  );
}
