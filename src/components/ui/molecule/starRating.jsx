import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

/**
 * Custom StarRating component - supports half-stars
 *
 * Example:
 *    <StarRating title="Super Star Rating Scale" rating={4.5} />
 */

export default function StarRating({
  title = '',
  rating = 0,
  outOf = 5,
  className = '',
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon
        key={`full-${i}`}
        className="h-8 w-8 text-orange-500 md:h-10 md:w-10"
      />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="relative h-8 w-8 md:h-10 md:w-10">
        <StarOutlineIcon className="absolute h-8 w-8 text-orange-500 md:h-10 md:w-10" />
        <StarIcon
          className="absolute h-8 w-8 text-orange-500 md:h-10 md:w-10"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarOutlineIcon
        key={`empty-${i}`}
        className="h-8 w-8 text-orange-500 md:h-10 md:w-10"
      />,
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={
          className ? `${className} text-core-black` : 'text-label-base'
        }
      >
        {title}
      </div>
      <div className="flex">{stars}</div>
    </div>
  );
}

StarRating.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.number,
  outOf: PropTypes.number,
  className: PropTypes.string,
};
