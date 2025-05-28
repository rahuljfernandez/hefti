import { Badge } from '../atom/badge';
import { getBadgeColor } from '../../../lib/getBadgeColor';
import { statTemplates } from '../../../lib/startTemplates';

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

const fallbackStats = [
  {
    key: 'Total Deficiencies',
    stat: '17',
    rating: 'Above Average',
  },
  {
    key: 'Staffing Score',
    stat: '1',
    rating: 'Below Average',
  },
  {
    key: 'Health Inspection',
    stat: '1',
    rating: 'Below Average',
  },
];

function formatValue(value, isCurrency = false) {
  if (!value) return 'N/A';
  return isCurrency ? `$${value}` : value;
}

function normalizeKey(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, chr) => chr.toUpperCase());
}

function StatCardItem({ stats = fallbackStats, variant = 'panel' }) {
  const styles = variants[variant];
  return (
    <div>
      <dl className={styles.wrapper}>
        {stats.map((item, i) => {
          const template = statTemplates[normalizeKey(item.key)];

          if (!template) return null;

          const {
            name,
            nationalAverage,
            description,
            isCurrency = false,
          } = template;

          return (
            <div key={template.name + i} className={styles.item}>
              <dt className="text-label-lg text-core-black flex items-center truncate">
                {name}
              </dt>
              <div className="flex flex-row gap-3 py-4">
                <dd className="text-heading-lg text-core-black leading-none">
                  {formatValue(item.stat, isCurrency)}
                </dd>
                <div className="flex items-center">
                  <Badge
                    color={getBadgeColor(item.rating)}
                    className="text-label-xs leading-none"
                  >
                    {item.rating}
                  </Badge>
                </div>
              </div>
              <div className="text-paragraph-base text-content-secondary">
                {description}
              </div>
              <div className="text-paragraph-base text-content-secondary py-1">
                National average: {formatValue(nationalAverage, isCurrency)}
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function StatsCard({ stats = fallbackStats, variant = 'card' }) {
  return <StatCardItem stats={stats} variant={variant} />;
}
