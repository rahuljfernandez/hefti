import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './starRating';
/**
 * Molecule that helps build out organisms
 * Has the CMS Ratings title that is frequently used with star rating
 */
export default function CMSRating({ stars = [] }) {
  return (
    <div>
      <div className="py-6">
        <div className="text-heading-xs">CMS Ratings</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {stars.map((stars, i) => (
          <div key={stars.title + i}>
            <StarRating
              title={stars.title}
              rating={stars.rating}
              size={stars.size}
              ratingSize={stars.ratingSize}
              className={stars.className}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

CMSRating.propTypes = {
  stars: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    }),
  ),
};
