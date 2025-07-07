import React from 'react';
import PropTypes from 'prop-types';
import StatsCard from '../molecule/statsCard';
import CMSRating from '../molecule/CMSRating';
import LayoutCard from '../atom/layout-card';
import StarRating from '../molecule/starRating';
import { Divider } from '../atom/divider';
import OwnerProfileDescription from '../molecule/ownerProfileDescription';
/**
 * Organism component that will be used to build Owner-Page this is the top block(Owner Highlights)
 *
 */

//need to incorporate teh correct data once its ready to work with
export default function OwenerProviderHighlights({ items }) {
  if (!items) return <div>No owner data available.</div>;

  // Use real data if available, otherwise fallback to hardcoded values
  const avgDeficiencies = items.avg_deficiencies ?? 11.2;
  const avgFines = items.avg_fines ?? 2.0;
  const avgFinesTotal = items.avg_fines_total ?? 265723;
  const overallRating = items.overall_rating ?? 2.8;
  const healthInspectionRating = items.health_inspection_rating ?? 2.8;
  const staffingRating = items.staffing_rating ?? 2.8;
  const qualityRating = items.quality_rating ?? 2.8;

  const ownerCardStats = [
    {
      key: 'Average Total Deficiencies',
      stat: avgDeficiencies,
      rating: 'Above Average',
      description:
        'Average numbor of serious deficiencies found in affiliated homes in the last three years',
      isCurrency: false,
    },
    {
      key: 'Average Number of Fines',
      stat: avgFines,
      rating: 'Below Average',
      description:
        'Average percentage of nursing staff who stopped working at affiliated homes over a 12-month period',
      isCurrency: false,
    },
    {
      key: 'Average Fines Total',
      stat: avgFinesTotal,
      rating: 'Below Average',
      description: 'Average total fines against affiliated homes.',
      isCurrency: true,
    },
  ];
  return (
    <LayoutCard>
      <div className="border-b border-gray-200 pb-5">
        <OwnerProfileDescription items={items} />
      </div>
      <div className="border-b border-gray-200 py-5">
        <CMSRating
          stars={[
            {
              title: 'Overall Star Rating',
              rating: overallRating,
              size: 'h-10 w-10',
              ratingSize: '4xl',
            },
          ]}
        />
        <div className="border-b border-gray-200 py-4 md:hidden"></div>
        <div className="flex flex-col md:flex-row md:pt-4">
          <div className="py-4">
            <div className="border-b border-gray-200 pb-4 md:border-r md:border-b-0 md:pr-8">
              <StarRating
                title="Health Inspection Rating"
                rating={healthInspectionRating}
                ratingSize="2xl"
              />
            </div>
          </div>
          <div className="py-4 md:px-8">
            <div className="border-b border-gray-200 pb-4 md:border-r md:border-b-0 md:pr-8">
              <StarRating
                title="Staffing Rating"
                rating={staffingRating}
                ratingSize="2xl"
              />
            </div>
          </div>
          <div className="py-4">
            <StarRating
              title="Quality Measures Rating"
              rating={qualityRating}
              ratingSize="2xl"
            />
          </div>
        </div>
      </div>

      <div className="">
        <StatsCard variant="panel" stats={ownerCardStats} />
      </div>
    </LayoutCard>
  );
}
