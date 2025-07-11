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
}) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarIcon key={`full-${i}`} className={`${size} text-orange-500`} />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className={`relative ${size} `}>
        <StarOutlineIcon className={`absolute ${size} text-orange-500`} />
        <StarIcon
          className={`absolute ${size} text-orange-500`}
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      </span>,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarOutlineIcon
        key={`empty-${i}`}
        className={`${size} text-orange-500`}
      />,
    );
  }

  return (
    <div className={`flex flex-col font-sans ${title ? 'gap-2' : ''}`}>
      <div
        className={
          className ? `${className} text-core-black` : 'text-label-base'
        }
      >
        {title}
      </div>
      <div className="flex items-center">
        {stars}
        <span className={`${textSizeClasses[ratingSize]} px-2 pt-1 font-bold`}>
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
};
