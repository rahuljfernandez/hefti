import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../atom/heading';
import TabsSelector from '../molecule/tabsSelector';
import ChoroplethLegend from '../molecule/choroplethLegend';
import UsStatesMap from '../molecule/usStatesMap';
import { StateMapSkeleton } from '../atom/skeletons';
import {
  EXPLORE_BY_STATE_TABS,
  DEFAULT_STATE_TAB,
  metricKeyForTab,
  statesToBuckets,
  buildStateMapCards,
} from '../../../lib/stateChoroplethMetrics';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * "Explore by State" home-page section.
 *
 * Owns the active Color-by tab, derives the per-state choropleth buckets for
 * that tab, and lays out the heading, subtitle, tab control, legend, and map.
 *
 * The per-state data is PLACEHOLDER (see stateChoroplethMetrics.js); this pass
 * is layout + interaction only — no live API, tooltip, or state selection.
 */
export default function ExploreByState() {
  const [activeTab, setActiveTab] = useState(
    EXPLORE_BY_STATE_TABS.find((t) => t.name === DEFAULT_STATE_TAB) ??
      EXPLORE_BY_STATE_TABS[0],
  );

  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  /* Fetch all five metrics once; tab switching is then a client-side lookup. */
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/state-metrics`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load state metrics');
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setPayload(json);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setPayload(null);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metric = payload?.metrics?.[metricKeyForTab(activeTab.name)];

  const data = useMemo(
    () => (metric ? statesToBuckets(metric.states) : {}),
    [metric],
  );

  /* Per-state hover-card content for the active tab, keyed by state name for an
     O(1) lookup on hover — switching tabs re-derives this without a refetch. */
  const cards = useMemo(
    () => (metric ? buildStateMapCards(metric) : {}),
    [metric],
  );

  /* Clicking a state routes to its profile. The card lookup carries the state
     code (the /states/:state route key)*/
  const navigate = useNavigate();
  const handleStateSelect = (stateName) => {
    const code = cards[stateName]?.stateCode;
    if (code) navigate(`/states/${code}`);
  };

  return (
    <div
      aria-labelledby="explore-by-state-heading"
      className="bg-background-secondary mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 xl:px-0"
    >
      {/* Header */}
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <Heading
          level={2}
          id="explore-by-state-heading"
          className="text-heading-lg font-bold"
        >
          Explore by State
        </Heading>
        <p className="text-label-base text-content-secondary mt-3">
          State-level statistics, acquisitions, and related-party properties
        </p>
      </div>

      {/* Tab control */}
      <div className="mb-6 flex justify-center">
        <TabsSelector
          tabsData={EXPLORE_BY_STATE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerClassName="w-full max-w-2xl bg-transparent"
          variant="bar"
        />
      </div>

      {/* Legend */}
      <div className="mb-6 flex justify-center">
        <ChoroplethLegend />
      </div>

      {/* Map — skeleton silhouette while /state-metrics is in flight. */}
      {status === 'ready' ? (
        <UsStatesMap
          data={data}
          cards={cards}
          onStateSelect={handleStateSelect}
          className="mx-auto max-w-5xl"
        />
      ) : (
        <StateMapSkeleton
          error={status === 'error'}
          className="mx-auto max-w-5xl"
        />
      )}
    </div>
  );
}
