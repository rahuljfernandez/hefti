import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import StatsCard from '../statsCard';
import ListContainer, {
  ListContainerGrid,
  ListContainerDivider,
} from '../../organism/ListContainer';
import { DeficiencyReportItem } from '../listContainerContent';
import {
  buildFacilityDeficienciesStats,
  buildFacilityPenaltiesStats,
  buildOwnerDeficienciesStats,
  buildOwnerPenaltiesStats,
  buildStateDeficienciesStats,
  buildStatePenaltiesStats,
} from '../../../../lib/deficienciesMetrics';

// Hardcoded placeholder until the API includes inspection_reports in the facility query and a date field is added to the inspection_reports table (pending Rahul).
const PLACEHOLDER_INSPECTION_REPORTS = [
  {
    id: 1,
    report_date: 'August 29, 2024',
    report_url: 'https://example.com/report-1.pdf',
  },
  {
    id: 2,
    report_date: 'June 5, 2024',
    report_url: 'https://example.com/report-2.pdf',
  },
  { id: 3, report_date: 'May 2, 2024', report_url: null },
];

/**
 * Deficiencies & Penalties tab content.
 *
 * Responsibilities:
 * - Builds deficiency and penalty stat groups from the provided data source
 * - Switches between facility and owner metric builders based on status
 * - Renders each group using ListContainer + ListContainerGrid + StatsCard
 */
export default function DeficienciesTab({
  metricsSource,
  status,
  nationalBenchmarks,
}) {
  const deficienciesStats =
    status === 'owner'
      ? buildOwnerDeficienciesStats(metricsSource)
      : status === 'state'
        ? buildStateDeficienciesStats(metricsSource, nationalBenchmarks)
        : buildFacilityDeficienciesStats(metricsSource, nationalBenchmarks);

  const penaltiesStats =
    status === 'owner'
      ? buildOwnerPenaltiesStats(metricsSource)
      : status === 'state'
        ? buildStatePenaltiesStats(metricsSource, nationalBenchmarks)
        : buildFacilityPenaltiesStats(metricsSource, nationalBenchmarks);

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
      <div className="my-8">
        <div>
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Deficiencies from Inspection Reports
          </Heading>
          <ListContainer
            items={deficienciesStats}
            LayoutSelector={ListContainerGrid}
            ListContent={StatsCard}
            layoutProps={{ cols: 1 }}
          />
          {/* DeficiencyReportItem is a placeholder — item shape and field names will
            need updating once the API exposes real inspection_reports fields. */}
          <div className="py-4">
            <ListContainer
              items={PLACEHOLDER_INSPECTION_REPORTS}
              LayoutSelector={ListContainerDivider}
              ListContent={DeficiencyReportItem}
            />
          </div>
        </div>

        <div className="pb-8">
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            Penalties
          </Heading>
          <ListContainer
            items={penaltiesStats}
            LayoutSelector={ListContainerGrid}
            ListContent={StatsCard}
            layoutProps={{ cols: status === 'owner' ? 2 : 3 }}
          />
        </div>
      </div>
    </section>
  );
}

DeficienciesTab.propTypes = {
  metricsSource: PropTypes.object,
  status: PropTypes.oneOf(['facility', 'owner', 'state']),
  nationalBenchmarks: PropTypes.object,
};
