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
} from '../../../../lib/clinicalQualityMetrics';

/**
 * Clinical quality tab content.
 *
 * Responsibilities:
 * - Builds long-stay and short-stay metric groups from the provided data source
 * - Switches between facility and owner metric builders based on status
 * - Shows owner-specific context when values represent weighted averages
 * - Renders each metric group using the shared long-form metric card layout
 */
export default function ClinicalQualityTab({
  metricsSource,
  status,
  nationalBenchmarks,
}) {
  // Build stat arrays from lib config; maps data keys to display-ready objects.
  const longStayStats =
    status === 'facility'
      ? buildFacilityLongStayStats(metricsSource, nationalBenchmarks)
      : buildOwnerLongStayStats(metricsSource);

  const shortStayStats =
    status === 'facility'
      ? buildFacilityShortStayStats(metricsSource, nationalBenchmarks)
      : buildOwnerShortStayStats(metricsSource);

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
