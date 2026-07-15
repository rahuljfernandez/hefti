import React from 'react';
import clsx from 'clsx';
import { STAR_LEVELS } from '../../../lib/ratingDistributionMetrics';

/**
 * Legend for the facility rating distribution: a color dot and star label for
 * each of the five rating levels. Reads its color config from STAR_LEVELS so it
 * always matches the bar segments.
 */
export default function RatingDistributionLegend() {
  return (
    <div className="border-border-primary inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-full border px-3 py-1.5">
      {STAR_LEVELS.map(({ star, colorClass }) => (
        <span
          key={star}
          className="text-label-sm text-content-secondary flex items-center gap-1.5"
        >
          <span className={clsx('h-2.5 w-2.5 rounded-full', colorClass)} />
          {star}★
        </span>
      ))}
    </div>
  );
}
