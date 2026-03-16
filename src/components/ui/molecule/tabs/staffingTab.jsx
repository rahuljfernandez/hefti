import React from 'react';
import LayoutCard from '../../atom/layout-card';
import CMSRating from '../CMSRating';
import { Divider } from '../../atom/divider';
import StaffingStatsCards from '../staffingStatsCards';

export default function StaffingTab({ items }) {
  console.log(items);
  //we barely have any of the data we need to complete this design.  I'm not sure what cna/rn/lpn hours per resident day are.  Don't see weekend specific data?  We don't have turnover data for the second section.
  const staffingLevelsFacilityStats = [
    {
      key: 'Nurse hours/residents/day',
      stat: items.cna_hours_per_resident_day,
      rating: 'Above Average',
      description: 'Reported total nurse staffing hours per resident per day.',
      nationalAverage: 3.9,
      isCurrency: false,
    },
    {
      key: 'RN Hours/resident/day',
      stat: items.rn_hours_per_resident_day,
      rating: 'Below Average',
      description:
        'Reported total Registered Nurse staffing hours per resident per day.',
      nationalAverage: 0.8,
      isCurrency: false,
    },
    {
      key: 'Nurse hours/resident/weekend',
      stat: items.lpn_hours_per_resident_day,
      rating: 'Above Average',
      description:
        'Reported total nurse staffing hours per resident on the weekend.',
      nationalAverage: 2.8,
      isCurrency: false,
    },
  ];

  const staffingTurnoverFacilityStats = [
    {
      key: 'Nurse hours/residents/day',
      stat: items.cna_hours_per_resident_day,
      rating: 'Above Average',
      description: 'Reported total nurse staffing hours per resident per day.',
      nationalAverage: 3.9,
      isCurrency: false,
    },
    {
      key: 'RN Hours/resident/day',
      stat: items.rn_hours_per_resident_day,
      rating: 'Below Average',
      description:
        'Reported total Registered Nurse staffing hours per resident per day.',
      nationalAverage: 0.8,
      isCurrency: false,
    },
    {
      key: 'Nurse hours/resident/weekend',
      stat: items.rn_hours_per_resident_day,
      rating: 'Above Average',
      description:
        'Reported total nurse staffing hours per resident on the weekend.',
      nationalAverage: 2.8,
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
          <div className={'text-heading-sm'}>Staffing Quality</div>
          <p className="text-paragraph-base">
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
                <StaffingStatsCards stats={staffingLevelsFacilityStats} />
              </div>
            </div>
            <Divider />
            {/*Statting Turnover*/}
            <div className="my-4">
              <div className="text-heading-xs">Staffing Turnover</div>
              {/*Cards */}
              <div>
                <StaffingStatsCards stats={staffingTurnoverFacilityStats} />
              </div>
            </div>
          </LayoutCard>
        </div>
      </div>
    </section>
  );
}
