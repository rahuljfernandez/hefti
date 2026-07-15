import React from 'react';
import PropTypes from 'prop-types';
import { buildRatingDistribution } from '../../../lib/ratingDistributionMetrics';
import RatingDistributionBar from '../molecule/ratingDistributionBar';
import RatingDistributionLegend from '../molecule/ratingDistributionLegend';

/**
 * Facility Rating Distribution.
 *
 * Renders a title/subtitle, one stacked bar per rating metric (overall, health,
 * staffing, quality) showing the share of facilities at each star level, and a
 * legend. Subject-agnostic: pass any `rating_distribution` payload of the shape
 * the API returns. Used on the state highlights view and reusable elsewhere.
 */
export default function FacilityRatingDistribution({
  distribution,
  title = 'Facility Rating Distribution',
  subtitle,
}) {
  const data = buildRatingDistribution(distribution);
  if (!data || data.metrics.length === 0) return null;

  const computedSubtitle =
    subtitle ??
    (data.totalFacilities != null
      ? `All ${data.totalFacilities} facilities by rating type`
      : 'By rating type');

  return (
    <section>
      <h3 className="text-heading-xs text-core-black">{title}</h3>
      <p className="text-paragraph-base text-content-secondary mt-1">
        {computedSubtitle}
      </p>

      {/* Column headers: left over the metric labels, right over the percentages
          (both bar edges align to this row's edges). */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-label-sm text-content-secondary uppercase">
          Rating Type
        </span>
        <span className="text-label-sm text-content-secondary uppercase">
          Below 3 Stars
        </span>
      </div>

      <div className="divide-border-primary divide-y">
        {data.metrics.map((metric) => (
          <RatingDistributionBar key={metric.key} metric={metric} />
        ))}
      </div>

      <div className="mt-8">
        <RatingDistributionLegend />
      </div>
    </section>
  );
}

FacilityRatingDistribution.propTypes = {
  // Raw `rating_distribution` object from the API response.
  distribution: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
