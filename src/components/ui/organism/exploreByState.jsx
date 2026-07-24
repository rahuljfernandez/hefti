import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../atom/heading';
import TabsSelector from '../molecule/tabsSelector';
import ChoroplethLegend from '../molecule/choroplethLegend';
import UsStatesMap from '../molecule/usStatesMap';
import { StateMapSkeleton } from '../atom/skeletons';
import { useStateMetrics } from '../../../hooks/useStateMetrics';
import {
  EXPLORE_BY_STATE_TABS,
  DEFAULT_STATE_TAB,
  metricKeyForTab,
  statesToBuckets,
  buildStateMapCards,
} from '../../../lib/stateChoroplethMetrics';

/**
 * "Explore by State" home-page section.
 *
 * Owns the active Color-by tab, derives the per-state choropleth buckets for
 * that tab, and lays out the heading, subtitle, tab control, legend, and map.
 *
 * Reads all five metrics from the shared useStateMetrics hook (one /state-metrics
 * request for the whole page); switching tabs is then a client-side lookup (no
 * refetch). Hovering a state shows its card; clicking a state routes to
 * /states/:code. Shows a skeleton while loading and a red-tinted skeleton on error.
 */
export default function ExploreByState() {
  const [activeTab, setActiveTab] = useState(
    EXPLORE_BY_STATE_TABS.find((t) => t.name === DEFAULT_STATE_TAB) ??
      EXPLORE_BY_STATE_TABS[0],
  );

  const { payload, status } = useStateMetrics();

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
