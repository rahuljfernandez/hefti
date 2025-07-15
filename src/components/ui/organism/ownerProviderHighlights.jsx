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
export default function OwenerProviderHighlights({ items, relatedFacilities }) {
  if (!items) return <div>No owner data available.</div>;
  console.log('rel', relatedFacilities);

  // Use real data if available, otherwise fallback to hardcoded values

  const finesAvgCount = relatedFacilities.length
    ? relatedFacilities.reduce(
        (sum, item) => sum + (item.number_of_fines || 0),
        0,
      ) / relatedFacilities.length
    : 0;

  const overallRating = (items.cms_owner_average_overall_rating ?? 0).toFixed(
    1,
  );
  const healthInspectionRating = (
    items.cms_owner_average_hi_rating ?? 0
  ).toFixed(1);
  const staffingRating = (items.cms_owner_average_staffing_rating ?? 0).toFixed(
    1,
  );
  const qualityRating = (items.cms_owner_average_quality_rating ?? 0).toFixed(
    1,
  );

  const ownerCardStats = [
    {
      key: 'Average Total Deficiencies',
      stat: items.cms_owner_average_deficiencies.toFixed(1),
      rating: items.national_comparison_deficiencies,
      description:
        'Average number of serious deficiencies found in affiliated homes in the last three years',
      isCurrency: false,
    },
    {
      key: 'Average Number of Fines',
      stat: finesAvgCount.toFixed(1),
      rating: 'Below Average',
      description:
        'Average percentage of nursing staff who stopped working at affiliated homes over a 12-month period',
      isCurrency: false,
    },
    {
      key: 'Average Fine',
      stat: items.cms_owner_average_fines,
      rating: items.national_comparison_fines,
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
              title: 'Average Rating Across All Facilities',
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

OwenerProviderHighlights.propTypes = {
  items: PropTypes.shape({
    cms_owner_average_deficiencies: PropTypes.number.isRequired,
    cms_owner_average_fines: PropTypes.number.isRequired,
    cms_owner_average_overall_rating: PropTypes.number.isRequired,
    cms_owner_average_hi_rating: PropTypes.number.isRequired,
    cms_owner_average_staffing_rating: PropTypes.number.isRequired,
    cms_owner_average_quality_rating: PropTypes.number.isRequired,

    cms_owner_total_facilities: PropTypes.number,
    national_comparison_deficiencies: PropTypes.string,
    national_comparison_fines: PropTypes.string,
  }).isRequired,

  relatedFacilities: PropTypes.arrayOf(
    PropTypes.shape({
      number_of_fines: PropTypes.number,
    }),
  ).isRequired,
};
