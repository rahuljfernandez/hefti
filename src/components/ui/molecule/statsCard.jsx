import React from 'react';
import { Badge } from '../atom/badge';
import { getBadgeColorAboveBelow } from '../../../lib/getBadgeColor';
import PropTypes from 'prop-types';

/**
 * This component is built with Application Ui Stats/Simple and Stats/With Shared Border.
 * The styles are applied to the components styling via the variant prop.
 *
 * card variant — single-item renderer, used as ListContent with ListContainer:
 *   { key, stat, rating, isCurrency, description, detail1, detail2 }
 *
 * panel variant — array renderer, used standalone:
 *   stats: [{ key, stat, rating, isCurrency, description, detail1, detail2 }]
 *
 * Example (card as ListContent):
 *   <ListContainer items={data} LayoutSelector={ListContainerGrid} ListContent={StatsCard} layoutProps={{ cols: 2 }} />
 *
 * Example (panel standalone):
 *   <StatsCard stats={data} variant="panel" />
 */

const panelVariant = {
  wrapper:
    'mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden bg-white md:grid-cols-3 md:divide-x md:divide-y-0',
  item: 'px-4 py-5 sm:p-6',
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

function StatCardItem({ item }) {
  return (
    <div className="border-border-primary h-full overflow-hidden rounded-lg border bg-white px-4 pt-5 pb-16 shadow-sm">
      <p className="text-label-lg text-core-black">{item.key}</p>
      <div className="flex flex-row gap-3 py-4">
        <p className="text-heading-lg text-core-black leading-none">
          {formatValue(item.stat, item.isCurrency)}
        </p>
        {item.rating && (
          <div className="flex items-center">
            <Badge
              color={item.ratingColor || getBadgeColorAboveBelow(item.rating)}
              className="text-label-xs leading-none"
            >
              {item.rating}
            </Badge>
          </div>
        )}
      </div>
      <p className="text-paragraph-base text-content-secondary">{item.description}</p>
      {(item.detail1 || item.detail2) && (
        <div className="text-paragraph-base text-content-secondary mt-3 flex flex-col gap-0.5">
          {item.detail1 && <span>{item.detail1}</span>}
          {item.detail2 && <span>{item.detail2}</span>}
        </div>
      )}
    </div>
  );
}

StatCardItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rating: PropTypes.string,
    ratingColor: PropTypes.string,
    isCurrency: PropTypes.bool,
    description: PropTypes.string,
    detail1: PropTypes.string,
    detail2: PropTypes.string,
  }).isRequired,
};

function StatCardLayout({ stats }) {
  return (
    <div>
      <dl className={panelVariant.wrapper} aria-label="Statistics summary">
        {stats.map((item, i) => (
          <div key={item.key + i} className={panelVariant.item}>
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
            <div className="text-paragraph-base text-content-secondary">{item.description}</div>
            {(item.detail1 || item.detail2) && (
              <div className="text-paragraph-base text-content-secondary mt-3 flex flex-col gap-0.5">
                {item.detail1 && <span>{item.detail1}</span>}
                {item.detail2 && <span>{item.detail2}</span>}
              </div>
            )}
          </div>
        ))}
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
      detail1: PropTypes.string,
      detail2: PropTypes.string,
    }),
  ).isRequired,
};

export default function StatsCard({ item, stats, variant = 'card' }) {
  if (variant === 'panel') {
    return <StatCardLayout stats={stats} />;
  }
  return <StatCardItem item={item} />;
}

StatsCard.propTypes = {
  item: PropTypes.object,
  stats: PropTypes.array,
  variant: PropTypes.oneOf(['card', 'panel']),
};
