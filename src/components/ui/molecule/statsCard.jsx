import React from 'react';
import { Badge } from '../atom/badge';
import { getBadgeColorAboveBelow } from '../../../lib/getBadgeColor';
import PropTypes from 'prop-types';

/**
 * This component is built with Application Ui Stats/Simple and Stats/With Shared Border.
 * The styles are applied to the components styling via the variant prop
 *
 * Example:
 *    StatsCard stats={data} variant="panel"
 */

const variants = {
  card: {
    wrapper: 'mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2',
    item: 'border-border-primary text-label-lg overflow-hidden rounded-lg border bg-white px-4 pt-5 pb-16 shadow-sm',
  },
  panel: {
    wrapper:
      'mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden bg-white md:grid-cols-3 md:divide-x md:divide-y-0',
    item: 'px-4 py-5 sm:p-6',
  },
};

function formatValue(value, isCurrency = false) {
  if (value === null || value === undefined || value === '') return 'N/A';

  const number = Number(value);
  if (isNaN(number)) return value;

  return isCurrency
    ? number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : number.toLocaleString();
}

function normalizeKey(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase());
}

//StatCardLayout handles all the styling
function StatCardLayout({ stats, variant = 'panel' }) {
  const styles = variants[variant];
  return (
    <div>
      <dl className={styles.wrapper}>
        {stats.map((item, i) => {
          return (
            <div key={item.key + i} className={styles.item}>
              <dt className="text-label-lg text-core-black flex items-center truncate">
                {item.key}
              </dt>
              <div className="flex flex-row gap-3 py-4">
                <dd className="text-heading-lg text-core-black leading-none">
                  {formatValue(item.stat, item.isCurrency)}
                </dd>
                <div className="flex items-center">
                  <Badge
                    color={getBadgeColorAboveBelow(item.rating)}
                    className="text-label-xs leading-none"
                  >
                    {item.rating}
                  </Badge>
                </div>
              </div>
              <div className="text-paragraph-base text-content-secondary">
                {item.description}
              </div>
              <div className="text-paragraph-base text-content-secondary py-1">
                {/* National average:{' '}
                {formatValue(nationalAverage, item.isCurrency)} */}
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

StatCardLayout.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.string,
      isCurrency: PropTypes.bool,
      description: PropTypes.string,
    }),
  ).isRequired,
  variant: PropTypes.oneOf(['card', 'panel']),
};

//Wrapper for StatCardLayout which applies the syling.
export default function StatsCard({ stats, variant = 'card' }) {
  return <StatCardLayout stats={stats} variant={variant} />;
}
