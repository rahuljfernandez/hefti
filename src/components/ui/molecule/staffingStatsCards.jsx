import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../atom/badge';

const ratingColors = {
  'above average': 'red',
  'above national average': 'red',
  average: 'yellow',
  'below average': 'green',
  'below national average': 'green',
};

function getRatingColor(rating) {
  if (!rating) return 'zinc';

  return ratingColors[rating.toLowerCase()] ?? 'zinc';
}

function formatValue(value, isCurrency = false) {
  if (value === null || value === undefined || value === '') return 'N/A';

  const number = Number(value);
  if (Number.isNaN(number)) return value;

  if (isCurrency) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  const valueAsString = String(value);
  const fractionalDigits = valueAsString.includes('.')
    ? valueAsString.split('.')[1].length
    : 0;

  return number.toLocaleString('en-US', {
    minimumFractionDigits: fractionalDigits,
    maximumFractionDigits: fractionalDigits,
  });
}

export default function StaffingStatsCards({ stats }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => (
        <article
          key={item.key + index}
          className="border-border-primary rounded-xl border bg-white px-4 py-4 shadow-sm"
        >
          <div className="flex items-start gap-2">
            <div className="text-core-black text-heading-lg leading-none">
              {formatValue(item.stat, item.isCurrency)}
            </div>
            {item.rating ? (
              <Badge
                color={getRatingColor(item.rating)}
                className="text-label-xs mt-1 leading-none"
              >
                {item.rating}
              </Badge>
            ) : null}
          </div>
          <div className="text-core-black text-label-lg mt-3">{item.key}</div>
          <p className="text-content-secondary text-paragraph-base mt-1">
            {item.description}
          </p>
          {item.nationalAverage !== undefined &&
          item.nationalAverage !== null &&
          item.nationalAverage !== '' ? (
            <div className="text-content-secondary text-paragraph-base mt-6">
              National average:{' '}
              {formatValue(item.nationalAverage, item.isCurrency)}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

StaffingStatsCards.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.string,
      description: PropTypes.string,
      nationalAverage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      isCurrency: PropTypes.bool,
    }),
  ).isRequired,
};
