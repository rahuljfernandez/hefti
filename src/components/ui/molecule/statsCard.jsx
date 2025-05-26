import { Badge } from '../atom/badge';
import { getBadgeColor } from '../../../lib/getBadgeColor';

const fallbackStats = [
  {
    id: 1,
    name: 'Total Penalties',
    stat: '17',
    rating: 'Above Average',
    nationalAveragePenalties: '3',
  },
  {
    id: 2,
    name: 'Total Fines',
    stat: '753,581',
    rating: 'Below Average',
    nationalAverageFines: '48,371',
  },
];

{
  /*TODO: adjust pading for responsive, awaiting design details */
}

export default function StatsCard({ stats = fallbackStats }) {
  return (
    <div className="">
      {/* <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3> */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.name}
            className="border-border-primary text-label-lg overflow-hidden rounded-lg border bg-white px-4 pt-5 pb-16 shadow-sm"
          >
            <dt className="text-label-lg text-core-black flex items-center truncate">
              {item.name}
            </dt>
            <div className="flex flex-row gap-3 py-4">
              <dd className="text-heading-lg text-core-black leading-none">
                {item.id === 1 ? item.stat : `$${item.stat}`}
              </dd>
              <div className="flex items-center">
                <Badge
                  color={getBadgeColor(item.rating)}
                  className={'text-label-xs leading-none'}
                >
                  {item.rating}
                </Badge>
              </div>
            </div>
            <div className="text-paragraph-base text-content-secondary">
              {item.id === 1
                ? 'Total penalties over three years'
                : 'Total amount of fines incurred over the last three years'}
            </div>
            <div className="text-paragraph-base text-content-secondary py-1">
              National average:{' '}
              {item.nationalAverageFines
                ? `$${item.nationalAverageFines}`
                : item.nationalAveragePenalties}
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
