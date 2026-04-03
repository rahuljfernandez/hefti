import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../../atom/layout-card';
import CMSRating from '../CMSRating';
import { Divider } from '../../atom/divider';
import ListContainer, { ListContainerGrid } from '../../organism/ListContainer';
import { StaffingStatCard } from '../listContainerContent';
import {
  buildFacilityStaffingLevels,
  buildFacilityStaffingTurnover,
  buildOwnerStaffingLevels,
  buildOwnerStaffingTurnover,
} from '../../../../lib/staffingMetrics';

export default function StaffingTab({ items, status }) {
  const staffingLevelsStats =
    status === 'facility'
      ? buildFacilityStaffingLevels(items)
      : buildOwnerStaffingLevels(items);

  const staffingTurnoverStats =
    status === 'facility'
      ? buildFacilityStaffingTurnover(items)
      : buildOwnerStaffingTurnover(items);

  const staffingRating =
    status === 'facility'
      ? items.staffing_rating
      : items.cms_owner_average_staffing_rating;

  return (
    <section>
      {/*Staffing Header */}
      <div className="my-8">
        <div className="">
          <div className={'text-heading-md'}>Staffing Quality</div>
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

      {/*Staffing Quality Statistics Section */}
      <div>
        {/*Statistics Header */}
        <div>
          <div className="text-heading-sm mb-2">Staffing Quality</div>
          <p className="text-paragraph-base mb-6">
            Averages from 2023-07-01 to 2024-06-30
          </p>
        </div>
        {/*Statistics Container*/}
        <div className="my-4">
          <LayoutCard>
            {/*CMS Rating*/}
            <CMSRating
              stars={[
                {
                  title: 'Overall Staffing Rating',
                  rating:
                    staffingRating,
                  size: 'h-10 w-10',
                  ratingSize: '4xl',
                  className: 'font-bold',
                },
              ]}
            />
            {/*Staffing Levels*/}
            <div className="my-4">
              <div className="text-heading-xs">Staffing Levels</div>
              <ListContainer
                items={staffingLevelsStats}
                LayoutSelector={ListContainerGrid}
                ListContent={StaffingStatCard}
              />
            </div>
            <Divider />
            {/*Staffing Turnover*/}
            <div className="my-4">
              <div className="text-heading-xs">Staffing Turnover</div>
              <ListContainer
                items={staffingTurnoverStats}
                LayoutSelector={ListContainerGrid}
                ListContent={StaffingStatCard}
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
};
