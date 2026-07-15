import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import ListContainer, {
  ListContainerSeparate,
} from '../../organism/ListContainer';
import { MetricCardLong } from '../listContainerContent';
import {
  buildFacilityLongStayStats,
  buildFacilityShortStayStats,
  buildOwnerLongStayStats,
  buildOwnerShortStayStats,
  buildStateLongStayStats,
  buildStateShortStayStats,
} from '../../../../lib/clinicalQualityMetrics';

/**
 * Clinical quality tab content.
 *
 * Responsibilities:
 * - Builds long-stay and short-stay metric groups from the provided data source
 * - Switches between facility, state, and owner metric builders based on status
 * - Shows owner-specific context when values represent weighted averages
 * - Renders each metric group using the shared long-form metric card layout
 */

/* Metric builders per subject type — each status maps its long/short-stay groups
   to the matching lib builder. Owner builders take only `metricsSource` and
   harmlessly ignore the benchmarks argument, so builders call uniformly. */
const STATS_BUILDERS = {
  facility: {
    longStay: buildFacilityLongStayStats,
    shortStay: buildFacilityShortStayStats,
  },
  state: {
    longStay: buildStateLongStayStats,
    shortStay: buildStateShortStayStats,
  },
  owner: {
    longStay: buildOwnerLongStayStats,
    shortStay: buildOwnerShortStayStats,
  },
};

export default function ClinicalQualityTab({
  metricsSource,
  status,
  nationalBenchmarks,
}) {
  // Pick the builder set for this subject type (owner is the default fallback).
  const builders = STATS_BUILDERS[status] ?? STATS_BUILDERS.owner;

  // Build stat arrays from lib config; maps data keys to display-ready objects.
  const longStayStats = builders.longStay(metricsSource, nationalBenchmarks);
  const shortStayStats = builders.shortStay(metricsSource, nationalBenchmarks);

  return (
    <section>
      {status === 'owner' && (
        <div className="pt-8">
          <p className="text-paragraph-lg">
            Scores represent the{' '}
            <span className="font-bold">weighted average </span>
            across all facilities under this owner&apos;s management.
          </p>
        </div>
      )}

      {/* Long-stay measures are grouped separately because CMS reports them as a distinct care context. */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Long Stay
        </Heading>
        <ListContainer
          items={longStayStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>

      {/* Short-stay measures use the same card layout but represent a different resident population. */}
      <div className="pb-8">
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Short Stay
        </Heading>
        <ListContainer
          items={shortStayStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
    </section>
  );
}

ClinicalQualityTab.propTypes = {
  metricsSource: PropTypes.object,
  status: PropTypes.string,
  nationalBenchmarks: PropTypes.object,
};
