import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';
import SimplePagination from './simplePagination';
import { RankingTableRow } from './listContainerContent';
import { RankingTablesSkeleton } from '../atom/skeletons';

const STATES = [
  {
    state: 'Alabama',
    overall_rank: 42,
    rank_financial: 38,
    rank_staffing: 45,
    rank_outcomes: 40,
  },
  {
    state: 'Alaska',
    overall_rank: 28,
    rank_financial: 22,
    rank_staffing: 19,
    rank_outcomes: 33,
  },
  {
    state: 'Arizona',
    overall_rank: 35,
    rank_financial: 31,
    rank_staffing: 37,
    rank_outcomes: 36,
  },
  {
    state: 'Arkansas',
    overall_rank: 48,
    rank_financial: 46,
    rank_staffing: 50,
    rank_outcomes: 47,
  },
  {
    state: 'California',
    overall_rank: 18,
    rank_financial: 20,
    rank_staffing: 15,
    rank_outcomes: 19,
  },
  {
    state: 'Colorado',
    overall_rank: 12,
    rank_financial: 14,
    rank_staffing: 10,
    rank_outcomes: 13,
  },
  {
    state: 'Connecticut',
    overall_rank: 7,
    rank_financial: 9,
    rank_staffing: 6,
    rank_outcomes: 8,
  },
  {
    state: 'Delaware',
    overall_rank: 23,
    rank_financial: 25,
    rank_staffing: 21,
    rank_outcomes: 22,
  },
  {
    state: 'Florida',
    overall_rank: 44,
    rank_financial: 43,
    rank_staffing: 41,
    rank_outcomes: 46,
  },
  {
    state: 'Georgia',
    overall_rank: 39,
    rank_financial: 36,
    rank_staffing: 42,
    rank_outcomes: 38,
  },
  {
    state: 'Hawaii',
    overall_rank: 16,
    rank_financial: 18,
    rank_staffing: 14,
    rank_outcomes: 17,
  },
  {
    state: 'Idaho',
    overall_rank: 26,
    rank_financial: 27,
    rank_staffing: 24,
    rank_outcomes: 28,
  },
  {
    state: 'Illinois',
    overall_rank: 31,
    rank_financial: 29,
    rank_staffing: 33,
    rank_outcomes: 30,
  },
  {
    state: 'Indiana',
    overall_rank: 20,
    rank_financial: 21,
    rank_staffing: 22,
    rank_outcomes: 18,
  },
  {
    state: 'Iowa',
    overall_rank: 9,
    rank_financial: 8,
    rank_staffing: 11,
    rank_outcomes: 7,
  },
  {
    state: 'Kansas',
    overall_rank: 17,
    rank_financial: 16,
    rank_staffing: 18,
    rank_outcomes: 16,
  },
  {
    state: 'Kentucky',
    overall_rank: 46,
    rank_financial: 47,
    rank_staffing: 44,
    rank_outcomes: 48,
  },
  {
    state: 'Louisiana',
    overall_rank: 51,
    rank_financial: 51,
    rank_staffing: 52,
    rank_outcomes: 50,
  },
  {
    state: 'Maine',
    overall_rank: 6,
    rank_financial: 7,
    rank_staffing: 5,
    rank_outcomes: 6,
  },
  {
    state: 'Maryland',
    overall_rank: 14,
    rank_financial: 12,
    rank_staffing: 16,
    rank_outcomes: 14,
  },
  {
    state: 'Massachusetts',
    overall_rank: 4,
    rank_financial: 5,
    rank_staffing: 3,
    rank_outcomes: 4,
  },
  {
    state: 'Michigan',
    overall_rank: 29,
    rank_financial: 28,
    rank_staffing: 30,
    rank_outcomes: 27,
  },
  {
    state: 'Minnesota',
    overall_rank: 3,
    rank_financial: 3,
    rank_staffing: 4,
    rank_outcomes: 3,
  },
  {
    state: 'Mississippi',
    overall_rank: 53,
    rank_financial: 53,
    rank_staffing: 53,
    rank_outcomes: 53,
  },
  {
    state: 'Missouri',
    overall_rank: 37,
    rank_financial: 35,
    rank_staffing: 39,
    rank_outcomes: 37,
  },
  {
    state: 'Montana',
    overall_rank: 22,
    rank_financial: 24,
    rank_staffing: 20,
    rank_outcomes: 24,
  },
  {
    state: 'Nebraska',
    overall_rank: 11,
    rank_financial: 10,
    rank_staffing: 13,
    rank_outcomes: 10,
  },
  {
    state: 'Nevada',
    overall_rank: 43,
    rank_financial: 41,
    rank_staffing: 46,
    rank_outcomes: 43,
  },
  {
    state: 'New Hampshire',
    overall_rank: 5,
    rank_financial: 6,
    rank_staffing: 7,
    rank_outcomes: 5,
  },
  {
    state: 'New Jersey',
    overall_rank: 32,
    rank_financial: 30,
    rank_staffing: 34,
    rank_outcomes: 31,
  },
  {
    state: 'New Mexico',
    overall_rank: 49,
    rank_financial: 48,
    rank_staffing: 48,
    rank_outcomes: 51,
  },
  {
    state: 'New York',
    overall_rank: 25,
    rank_financial: 26,
    rank_staffing: 23,
    rank_outcomes: 26,
  },
  {
    state: 'North Carolina',
    overall_rank: 36,
    rank_financial: 34,
    rank_staffing: 38,
    rank_outcomes: 34,
  },
  {
    state: 'North Dakota',
    overall_rank: 8,
    rank_financial: 11,
    rank_staffing: 8,
    rank_outcomes: 9,
  },
  {
    state: 'Ohio',
    overall_rank: 21,
    rank_financial: 23,
    rank_staffing: 25,
    rank_outcomes: 20,
  },
  {
    state: 'Oklahoma',
    overall_rank: 47,
    rank_financial: 45,
    rank_staffing: 49,
    rank_outcomes: 45,
  },
  {
    state: 'Oregon',
    overall_rank: 13,
    rank_financial: 13,
    rank_staffing: 12,
    rank_outcomes: 15,
  },
  {
    state: 'Pennsylvania',
    overall_rank: 24,
    rank_financial: 19,
    rank_staffing: 26,
    rank_outcomes: 23,
  },
  {
    state: 'Rhode Island',
    overall_rank: 15,
    rank_financial: 17,
    rank_staffing: 17,
    rank_outcomes: 12,
  },
  {
    state: 'South Carolina',
    overall_rank: 40,
    rank_financial: 39,
    rank_staffing: 40,
    rank_outcomes: 41,
  },
  {
    state: 'South Dakota',
    overall_rank: 10,
    rank_financial: 15,
    rank_staffing: 9,
    rank_outcomes: 11,
  },
  {
    state: 'Tennessee',
    overall_rank: 41,
    rank_financial: 40,
    rank_staffing: 43,
    rank_outcomes: 39,
  },
  {
    state: 'Texas',
    overall_rank: 45,
    rank_financial: 44,
    rank_staffing: 47,
    rank_outcomes: 44,
  },
  {
    state: 'Utah',
    overall_rank: 19,
    rank_financial: 32,
    rank_staffing: 16,
    rank_outcomes: 21,
  },
  {
    state: 'Vermont',
    overall_rank: 2,
    rank_financial: 2,
    rank_staffing: 2,
    rank_outcomes: 2,
  },
  {
    state: 'Virginia',
    overall_rank: 27,
    rank_financial: 33,
    rank_staffing: 27,
    rank_outcomes: 29,
  },
  {
    state: 'Washington',
    overall_rank: 1,
    rank_financial: 1,
    rank_staffing: 1,
    rank_outcomes: 1,
  },
  {
    state: 'West Virginia',
    overall_rank: 50,
    rank_financial: 50,
    rank_staffing: 51,
    rank_outcomes: 49,
  },
  {
    state: 'Wisconsin',
    overall_rank: 30,
    rank_financial: 42,
    rank_staffing: 28,
    rank_outcomes: 32,
  },
  {
    state: 'Wyoming',
    overall_rank: 34,
    rank_financial: 37,
    rank_staffing: 32,
    rank_outcomes: 35,
  },
  {
    state: 'D.C.',
    overall_rank: 33,
    rank_financial: 44,
    rank_staffing: 36,
    rank_outcomes: 25,
  },
  {
    state: 'Puerto Rico',
    overall_rank: 52,
    rank_financial: 52,
    rank_staffing: 54,
    rank_outcomes: 52,
  },
  {
    state: 'Guam',
    overall_rank: 38,
    rank_financial: 49,
    rank_staffing: 29,
    rank_outcomes: 42,
  },
];

const PAGE_SIZE = 5;

/**
 * Segmented Best / Worst toggle for ranking tables.
 * Announces the active selection to screen readers via aria-pressed.
 */
export function RankingTablesToggle({ value, onChange }) {
  const options = ['Best', 'Worst'];
  return (
    <div
      role="group"
      aria-label="Sort order"
      className="text-label-sm border-border-primary flex overflow-hidden rounded-md border shadow-sm"
    >
      {options.map((option) => {
        const active = value === option.toLowerCase();
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option.toLowerCase())}
            aria-pressed={active}
            className={clsx(
              'focus-panel-light text-core-black px-3 py-1.5 transition-colors hover:cursor-pointer',
              active
                ? 'bg-background-primary'
                : 'bg-background-tertiary hover:bg-white',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

RankingTablesToggle.propTypes = {
  value: PropTypes.oneOf(['best', 'worst']).isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Paginated state ranking table with Best / Worst toggle.
 *
 * Data is hardcoded in STATES until the backend endpoint is ready.
 * When the API lands, replace STATES with the fetched payload and drive
 * isLoading / error from the query state.
 *
 * Props:
 * - title:     heading shown above the list
 * - metric:    which ranking column to sort by (overall_rank | rank_financial | rank_staffing | rank_outcomes)
 * - isLoading: renders the skeleton while data is in flight
 * - error:     renders the error skeleton if the fetch fails
 */
export default function RankingTables({ title, metric = 'overall_rank', isLoading = false, error = false }) {
  const [toggle, setToggle] = useState('best');
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading || error) return <RankingTablesSkeleton error={error} />;

  const handleToggle = (val) => {
    setToggle(val);
    setCurrentPage(1);
  };

  const sorted = [...STATES].sort((a, b) =>
    toggle === 'best' ? a[metric] - b[metric] : b[metric] - a[metric],
  );

  const totalItems = sorted.length;
  const pageItems = sorted
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .map((s) => ({
      id: s.state,
      rank: s[metric],
      name: s.state,
      badgeColor: s[metric] <= 10 ? 'green' : s[metric] > STATES.length - 10 ? 'red' : 'zinc',
    }));

  return (
    <div className="py-2">
      <LayoutCard>
        {/*Title/Toggle */}
        <div className="flex items-center justify-between pb-4">
          <Heading level={4}>{title}</Heading>
          <RankingTablesToggle value={toggle} onChange={handleToggle} />
        </div>
        {/*Table */}
        <ul role="list" aria-label={`${title} results`} className="divide-y divide-gray-200">
          {pageItems.map((item) => (
            <li key={item.id} className="py-3">
              <RankingTableRow item={item} />
            </li>
          ))}
        </ul>
        {/*Pagination */}
        <SimplePagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, Math.ceil(totalItems / PAGE_SIZE)),
            )
          }
        />
      </LayoutCard>
    </div>
  );
}

RankingTables.propTypes = {
  title: PropTypes.string,
  metric: PropTypes.oneOf([
    'overall_rank',
    'rank_financial',
    'rank_staffing',
    'rank_outcomes',
  ]),
  isLoading: PropTypes.bool,
  error: PropTypes.bool,
};
