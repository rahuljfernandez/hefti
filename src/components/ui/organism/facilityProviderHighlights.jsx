import React from 'react';
import PropTypes from 'prop-types';

import StatsCard from '../molecule/statsCard';
import CMSRating from '../molecule/CMSRating';
import LayoutCard from '../atom/layout-card';
import StarRating from '../molecule/starRating';
import { Divider } from '../atom/divider';
import FacilityProfileDescription from '../molecule/facilityProfileDescription';
/**
 * Organism component that will be used to build FaciltyPage-this is the top block(Provider Highlights)
 *
 */

export default function FacilityProviderHighlights({ items }) {
  if (!items) return <div>No facility data available.</div>;
  console.log('items:', items);
  //Todo: The descripts need updating
  const facilityCardStats = [
    {
      key: 'Total Deficiencies',
      stat: items.health_deficiencies ?? 'N/A',
      rating: items.national_comparison_deficiencies ?? 'N/A',
      description:
        'Average numbor of serious deficiencies found in affiliated homes in the last three years',
      isCurrency: false,
    },
    {
      key: 'Number of Fines',
      stat: items.number_of_fines ?? 'N/A',
      rating: items.national_comparison_fines ?? 'N/A',
      description:
        'Average percentage of nursing staff who stopped working at affiliated homes over a 12-month period',
      isCurrency: false,
    },
    {
      key: 'Fines Total',
      stat: items.total_amount_of_fines_in_usd ?? 'N/A',
      rating: items.national_comparison_fines ?? 'N/A',
      description: 'Average total fines against affiliated homes.',
      isCurrency: true,
    },
  ];
  return (
    <LayoutCard>
      <div className="border-b border-gray-200 pb-5">
        <FacilityProfileDescription items={items} />
      </div>
      <div className="border-b border-gray-200 py-5">
        <CMSRating
          stars={[
            {
              title: 'Overall Star Rating',
              rating: items.overall_rating ?? 'N/A',
              size: 'h-10 w-10',
              ratingSize: '4xl',
              className: 'font-bold',
            },
          ]}
        />
        <div className="border-b border-gray-200 py-4 md:hidden"></div>
        <div className="flex flex-col md:flex-row md:pt-4">
          <div className="py-4">
            <div className="border-b border-gray-200 pb-4 md:border-r md:border-b-0 md:pr-8">
              <StarRating
                title="Health Inspection Rating"
                rating={items.health_inspection_rating ?? 'N/A'}
                ratingSize="2xl"
              />
            </div>
          </div>
          <div className="py-4 md:px-8">
            <div className="border-b border-gray-200 pb-4 md:border-r md:border-b-0 md:pr-8">
              <StarRating
                title="Staffing Rating"
                rating={items.staffing_rating ?? 'N/A'}
                ratingSize="2xl"
              />
            </div>
          </div>
          <div className="py-4">
            <StarRating
              title="Quality Measures Rating"
              rating={items.quality_rating ?? 'N/A'}
              ratingSize="2xl"
            />
          </div>
        </div>
      </div>

      <div className="">
        <StatsCard variant="panel" stats={facilityCardStats} />
      </div>
    </LayoutCard>
  );
}

FacilityProviderHighlights.propTypes = {
  items: PropTypes.shape({
    health_deficiencies: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    number_of_fines: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total_amount_of_fines_in_usd: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    national_comparison_fines: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    national_comparison_deficiencies: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    quality_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    staffing_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    health_inspection_rating: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    overall_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};
