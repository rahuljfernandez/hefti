import { Badge } from './badge';

{
  /*TODO: adjust pading for responsive, awaiting design details */
}
export default function StatsCard({ stats }) {
  return (
    <div className="">
      {/* <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3> */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.name}
            className="border-border-primary overflow-hidden rounded-lg border bg-white px-4 pt-5 pb-16 shadow-sm"
          >
            <dt className="text-label-lg text-core-black flex items-center truncate">
              {item.name}
            </dt>
            <div className="flex flex-row gap-3 py-4">
              <dd className="text-heading-lg text-core-black leading-5">
                {item.id === 1 ? item.stat : `$${item.stat}`}
              </dd>
              <div className="flex items-center">
                <Badge color="red" className={'text-label-xs leading-none'}>
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
