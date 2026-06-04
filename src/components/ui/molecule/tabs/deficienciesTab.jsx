import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import StatsCard from '../statsCard';
import {
  buildFacilityDeficienciesStats,
  buildFacilityPenaltiesStats,
  buildOwnerDeficienciesStats,
  buildOwnerPenaltiesStats,
} from '../../../../lib/deficienciesMetrics';

/**
 * Deficiencies & Penalties tab content.
 *
 * Responsibilities:
 * - Builds deficiency and penalty stat groups from the provided data source
 * - Switches between facility and owner metric builders based on status
 * - Renders each group using the shared StatsCard layout
 */
export default function DeficienciesTab({ metricsSource, status, nationalBenchmarks }) {
  const deficienciesStats =
    status === 'owner'
      ? buildOwnerDeficienciesStats(metricsSource)
      : buildFacilityDeficienciesStats(metricsSource, nationalBenchmarks);

  const penaltiesStats =
    status === 'owner'
      ? buildOwnerPenaltiesStats(metricsSource)
      : buildFacilityPenaltiesStats(metricsSource, nationalBenchmarks);

  return (
    <section>
      <div className="my-8">
        <div>
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Deficiencies from Inspection Reports
          </Heading>
          <StatsCard stats={deficienciesStats} variant="card" />
        </div>

        <div className="pb-8">
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Penalties
          </Heading>
          <StatsCard stats={penaltiesStats} variant="card" />
        </div>
      </div>
    </section>
  );
}

DeficienciesTab.propTypes = {
  metricsSource: PropTypes.object,
  status: PropTypes.oneOf(['facility', 'owner']),
  nationalBenchmarks: PropTypes.object,
};
