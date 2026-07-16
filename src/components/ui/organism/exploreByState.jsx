import React, { useMemo, useState } from 'react';
import { Heading } from '../atom/heading';
import TabsSelector from '../molecule/tabsSelector';
import ChoroplethLegend from '../molecule/choroplethLegend';
import UsStatesMap from '../molecule/usStatesMap';
import { US_STATE_NAMES } from '../../../lib/usStatesGeo';
import {
  EXPLORE_BY_STATE_TABS,
  DEFAULT_STATE_TAB,
  buildStateChoropleth,
} from '../../../lib/stateChoroplethMetrics';

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

  const data = useMemo(
    () => buildStateChoropleth(activeTab.name, US_STATE_NAMES),
    [activeTab.name],
  );

  return (
    <section
      aria-labelledby="explore-by-state-heading"
      className="mx-auto max-w-[960px] px-4 py-16 font-sans sm:px-6 lg:px-8 xl:px-0"
    >
      {/* Header */}
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <Heading
          level={2}
          id="explore-by-state-heading"
          className="text-heading-lg font-serif font-bold"
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
          containerClassName="bg-transparent"
          variant="inline"
        />
      </div>

      {/* Legend */}
      <div className="mb-6 flex justify-center">
        <ChoroplethLegend />
      </div>

      {/* Map */}
      <UsStatesMap data={data} className="mx-auto max-w-4xl" />
    </section>
  );
}
