import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../../atom/layout-card';
import CMSRating from '../CMSRating';
import { Divider } from '../../atom/divider';
import ListContainer, { ListContainerGrid } from '../../organism/ListContainer';
import StatsCard from '../statsCard';
import {
  buildFacilityStaffingLevels,
  buildFacilityStaffingTurnover,
  buildOwnerStaffingLevels,
  buildOwnerStaffingTurnover,
  buildStateStaffingLevels,
  buildStateStaffingTurnover,
} from '../../../../lib/staffingMetrics';
/**
 * Staffing tab content.
 *
 * Responsibilities:
 * - Builds staffing-level and turnover metric groups from the supplied data source
 * - Chooses facility, state, or owner metric builders based on status
 * - Selects the correct staffing rating field for the CMS rating display
 * - Renders the staffing summary and supporting cards in a single tab panel
 */

/* Metric builders per subject type — each status maps its staffing groups to the
   matching lib builder. Facility/owner builders take only `items` and harmlessly
   ignore the benchmarks argument, so every builder can be called uniformly. */
const STATS_BUILDERS = {
  facility: {
    levels: buildFacilityStaffingLevels,
    turnover: buildFacilityStaffingTurnover,
  },
  state: {
    levels: buildStateStaffingLevels,
    turnover: buildStateStaffingTurnover,
  },
  owner: {
    levels: buildOwnerStaffingLevels,
    turnover: buildOwnerStaffingTurnover,
  },
};

export default function StaffingTab({ items, status, nationalBenchmarks }) {
  // Pick the builder set for this subject type (owner is the default fallback).
  const builders = STATS_BUILDERS[status] ?? STATS_BUILDERS.owner;

  // Build stat arrays from lib config — maps data keys to display-ready objects
  const staffingLevelsStats = builders.levels(items, nationalBenchmarks);
  const staffingTurnoverStats = builders.turnover(items, nationalBenchmarks);

  // Select the rating field that matches the current profile type.
  const staffingRating =
    status === 'owner'
      ? items.cms_owner_average_staffing_rating
      : items.staffing_rating;

  return (
    <section>
      {/* Intro copy explains how staffing levels and turnover should be interpreted. */}
      <div className="my-8">
        <div className="">
          <h2 className="text-heading-md">Staffing Quality</h2>
        </div>
        <div className="my-4">
          <p className="text-paragraph-lg mb-4">
            Higher staffing levels and lower staffing turnover in a nursing home
            may mean higher quality of care for residents. Hours worked by
            different types of staff are reported by nursing homes, and are used
            to calculate a ratio of staffing hours per resident per day and the
            staffing turnover rate. Hours per resident per day describe the
            average amount of time staff are available to spend with each
            resident each day. Staff turnover describes how many staff stop
            working at the facility within a given year.
          </p>
          <p className="text-paragraph-lg font-bold">
            HEFTI tracks data going back to 2010
          </p>
        </div>
      </div>

      {/* This section combines the overall staffing rating with the two supporting metric groups. */}
      <div>
        <div>
          <div className="text-heading-sm mb-2">Staffing Quality</div>
          <p className="text-paragraph-base mb-6">
            Averages from 2023-07-01 to 2024-06-30
          </p>
        </div>
        <div className="my-4">
          <LayoutCard>
            {/* The CMS rating provides a quick summary before the supporting detail cards. */}
            <CMSRating
              stars={[
                {
                  title: 'Overall Staffing Rating',
                  rating: staffingRating,
                  size: 'h-10 w-10',
                  ratingSize: '4xl',
                  className: 'font-bold',
                },
              ]}
            />
            {/* Staffing level cards show hours-per-resident metrics by staff category. */}
            <div className="my-4">
              <h3 className="text-heading-xs">Staffing Levels</h3>
              <ListContainer
                items={staffingLevelsStats}
                LayoutSelector={ListContainerGrid}
                ListContent={StatsCard}
                layoutProps={{ cols: 3 }}
              />
            </div>
            <Divider />
            {/* Turnover cards show how frequently key staff roles change over time. */}
            <div className="my-4">
              <h3 className="text-heading-xs">Staffing Turnover</h3>
              <ListContainer
                items={staffingTurnoverStats}
                LayoutSelector={ListContainerGrid}
                ListContent={StatsCard}
                layoutProps={{ cols: 3 }}
              />
            </div>
          </LayoutCard>
        </div>
      </div>
    </section>
  );
}

StaffingTab.propTypes = {
  items: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  nationalBenchmarks: PropTypes.object,
};
