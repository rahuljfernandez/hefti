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
 *  This component displays the Clinical Quality Measures data for an individual facility. Will be apart of the dynamic tabs scheme.
 */

export default function ClinicalQualityTab({
  metricsSource,
  status,
  national,
}) {
  const data = metricsSource;

  const facilityLongStayStats = buildFacilityLongStayStats(data, national);
  const facilityShortStayStats = buildFacilityShortStayStats(data, national);
  const ownerLongStayStats = buildOwnerLongStayStats(data);
  const ownerShortStayStats = buildOwnerShortStayStats(data);

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

      {/**Long Stay Stats */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Long Stay
        </Heading>
        <ListContainer
          items={
            status === 'facility' ? facilityLongStayStats : ownerLongStayStats
          }
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
      {/**Long Stay Stats */}
      <div className="pb-8">
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Short Stay
        </Heading>
        <ListContainer
          items={
            status === 'facility' ? facilityShortStayStats : ownerShortStayStats
          }
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
  national: PropTypes.object,
};
