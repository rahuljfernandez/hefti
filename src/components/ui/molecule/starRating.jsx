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

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

export default function StarRating({
  title = '',
  rating = 0,
  outOf = 5,
  className = '',
  size = 'h-8 w-8',
  ratingSize = 'base',
  starColorClass = 'text-orange-500',
  ratingTextClass = 'text-core-black',
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon key={`full-${i}`} className={`${size} ${starColorClass}`} />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className={`relative ${size} `}>
        <StarOutlineIcon className={`absolute ${size} ${starColorClass}`} />
        <StarIcon
          className={`absolute ${size} ${starColorClass}`}
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarOutlineIcon
        key={`empty-${i}`}
        className={`${size} ${starColorClass}`}
      />,
    );
  }

  return (
    <div
      className={`flex flex-col font-sans ${title ? 'gap-2' : ''}`}
      role="img"
      aria-label={`${title}: ${rating} out of ${outOf} stars`}
    >
      <div
        className={
          className ? `${className} text-core-black` : 'text-label-base'
        }
        aria-hidden="true"
      >
        {title}
      </div>
      <div className="flex items-center" aria-hidden="true">
        {stars}
        <span
          className={`${textSizeClasses[ratingSize]} ${ratingTextClass} px-2 pt-1 font-bold`}
        >
          {rating}
        </span>
      </div>
    </div>
  );
}

StarRating.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.number,
  outOf: PropTypes.number,
  className: PropTypes.string,
  size: PropTypes.string,
  ratingSize: PropTypes.string,
  starColorClass: PropTypes.string,
  ratingTextClass: PropTypes.string,
};
