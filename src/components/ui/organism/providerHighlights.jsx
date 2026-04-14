import React from 'react';
import PropTypes from 'prop-types';
import StatsCard from '../molecule/statsCard';
import CMSRating from '../molecule/CMSRating';
import LayoutCard from '../atom/layout-card';
import StarRating from '../molecule/starRating';
import FacilityProfileDescription from '../molecule/facilityProfileDescription';
import OwnerProfileDescription from '../molecule/ownerProfileDescription';
import { Heading } from '../atom/heading';
import {
  buildFacilityCardStats,
  buildOwnerCardStats,
} from '../../../lib/providerHighlightsMetrics';
import { formatMetricValue } from '../../../lib/stringFormatters';

/**
 * Shared highlights component for both facility and owner profile pages.
 * Pass status="facility" or status="owner" to select the correct headings,
 * data keys, and stat builders. Layout and structure are identical for both.
 */

/**
 * Drives all status-specific values — headings, data keys, and the stat builder.
 */
const config = {
  facility: {
    heading: 'Provider Highlights',
    overallRatingTitle: 'Overall Star Rating',
    overallRatingKey: 'overall_rating',
    healthInspectionKey: 'health_inspection_rating',
    staffingKey: 'staffing_rating',
    qualityKey: 'quality_rating',
    buildCardStats: buildFacilityCardStats,
  },
  owner: {
    heading: 'Owner Highlights',
    overallRatingTitle: 'Average Rating Across All Facilities',
    overallRatingKey: 'cms_owner_average_overall_rating',
    healthInspectionKey: 'cms_owner_average_hi_rating',
    staffingKey: 'cms_owner_average_staffing_rating',
    qualityKey: 'cms_owner_average_quality_rating',
    buildCardStats: buildOwnerCardStats,
  },
};

export default function ProviderHighlights({ items, status }) {
  if (!items) return <div>No data available.</div>;

  const cfg = config[status];
  if (!cfg) return null;

  // storing the 4 rating metrics to be used in a star rating display
  const overallRating = formatMetricValue(items[cfg.overallRatingKey]);
  const healthInspectionRating = formatMetricValue(
    items[cfg.healthInspectionKey],
  );
  const staffingRating = formatMetricValue(items[cfg.staffingKey]);
  const qualityRating = formatMetricValue(items[cfg.qualityKey]);

  // Build stat arrays from lib config — maps data keys to display-ready objects
  const cardStats = cfg.buildCardStats(items);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        {cfg.heading}
      </Heading>
      <LayoutCard>
        <div className="border-b border-gray-200 pb-5">
          {status === 'facility' ? (
            <FacilityProfileDescription items={items} />
          ) : (
            <OwnerProfileDescription items={items} />
          )}
        </div>
        {/*Star Rating Section */}
        <div className="border-b border-gray-200 py-5">
          <CMSRating
            stars={[
              {
                title: cfg.overallRatingTitle,
                rating: overallRating,
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
        {/*Stat Card Section*/}
        <div className="">
          <StatsCard variant="panel" stats={cardStats} />
        </div>
      </LayoutCard>
    </section>
  );
}

ProviderHighlights.propTypes = {
  items: PropTypes.object.isRequired,
  status: PropTypes.oneOf(['facility', 'owner']).isRequired,
};
