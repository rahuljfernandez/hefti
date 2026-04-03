import React from 'react';
import LayoutCard from '../../atom/layout-card';
import CMSRating from '../CMSRating';
import { Divider } from '../../atom/divider';
import StaffingStatsCards from '../staffingStatsCards';
import {
  formatMetricValue,
  expandStateAbbreviation,
} from '../../../../lib/stringFormatters';

export default function StaffingTab({ items }) {
  console.log(items);

  const facilityStaffingLevelsStats = [
    {
      key: 'LPN hours/residents/day',
      stat: formatMetricValue(items.lpn_hprd),
      rating: items.cmpr_lpn_hprd,
      description: 'Reported total nurse staffing hours per resident per day.',
      state: expandStateAbbreviation(items?.state),
      stateAvg: formatMetricValue(items.state_lpn_hprd),
      isCurrency: false,
    },
    {
      key: 'RN Hours/resident/day',
      stat: formatMetricValue(items.rn_hprd),
      rating: items.cmpr_rn_hprd,
      description:
        'Reported total Registered Nurse staffing hours per resident per day.',
      state: expandStateAbbreviation(items?.state),
      stateAvg: formatMetricValue(items.state_rn_hprd),
      isCurrency: false,
    },
    {
      key: 'Nurse hours/resident/weekend',
      stat: formatMetricValue(items.lpn_hprw),
      rating: items.cmpr_lpn_hprw,
      description:
        'Reported total nurse staffing hours per resident on the weekend.',
      state: expandStateAbbreviation(items?.state),
      stateAvg: formatMetricValue(items.state_lpn_hprw),
      isCurrency: false,
    },
  ];

  const facilityStaffingTurnoverStats = [
    {
      key: 'Nursing Staff Turnover',
      stat: formatMetricValue(items.nursing_turnover),
      rating: items.cmpr_nursing_turnover,
      description: 'Total staff turnover for staff over X number of quarters',
      state: expandStateAbbreviation(items?.state),
      stateAvg: formatMetricValue(items.state_nursing_turnover),
      isCurrency: false,
    },
    {
      key: 'RN Hours/resident/day',
      stat: formatMetricValue(items.rn_hours_per_resident_day),
      rating: null,
      description:
        'Total resgistered staff turnover for staff over X number of quarters',
      state: expandStateAbbreviation(items?.state),
      stateAvg: 0.8,
      isCurrency: false,
    },
    {
      key: 'Nurse hours/resident/weekend',
      stat: formatMetricValue(items.rn_hours_per_resident_day),
      rating: null,
      description:
        'Number of administrators who have left over X number of quarters',
      state: expandStateAbbreviation(items?.state),
      stateAvg: 2.8,
      isCurrency: false,
    },
  ];
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
                  rating: items.staffing_rating ?? 'N/A',
                  size: 'h-10 w-10',
                  ratingSize: '4xl',
                  className: 'font-bold',
                },
              ]}
            />
            {/*Staffing Levels*/}
            <div className="my-4">
              <div className="text-heading-xs">Staffing Levels</div>
              {/*Cards */}
              <div>
                <StaffingStatsCards stats={facilityStaffingLevelsStats} />
              </div>
            </div>
            <Divider />
            {/*Statting Turnover*/}
            <div className="my-4">
              <div className="text-heading-xs">Staffing Turnover</div>
              {/*Cards */}
              <div>
                <StaffingStatsCards stats={facilityStaffingTurnoverStats} />
              </div>
            </div>
          </LayoutCard>
        </div>
      </div>
    </section>
  );
}
