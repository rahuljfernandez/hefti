import React from 'react';
import PropTypes from 'prop-types';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import LayoutCard from '../atom/layout-card';
import AcquisitionsCtaBanner from '../molecule/acquisitionsCtaBanner';

const WINDOW_DAYS = 30;
const TOTAL_CHANGES = 16;

// TODO: replace with the ownership-changes feed endpoint when the backend ships.
const RECENT_DEALS = [
  {
    id: '1',
    buyer: 'Ridgeline Senior Care',
    seller: 'Meridian Care Partners',
    facilityCount: 7,
    date: '2026-06-18',
  },
  {
    id: '2',
    buyer: 'Cascade Care Group LLC',
    seller: 'Prospect Holding LLC',
    facilityCount: 1,
    date: '2026-06-14',
  },
  {
    id: '3',
    buyer: 'Northstar Healthcare Holdings',
    seller: 'Sable Point Capital',
    facilityCount: 3,
    date: '2026-06-09',
  },
  {
    id: '4',
    buyer: 'Halcyon Post-Acute Group',
    seller: 'Bayard Health Partners',
    facilityCount: 12,
    date: '2026-06-05',
  },
  {
    id: '5',
    buyer: 'Kestrel Care Holdings',
    seller: 'Diversicare Holdings',
    facilityCount: 2,
    date: '2026-06-03',
  },
];

function facilityLabel(count) {
  return `${count} ${count === 1 ? 'facility' : 'facilities'}`;
}

function formatFeedDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function FeedRow({ deal, isLast }) {
  const date = formatFeedDate(deal.date);

  return (
    <li className="relative pb-6">
      {!isLast && (
        <span
          aria-hidden="true"
          className="bg-border-primary absolute top-4 left-4 -ml-px h-full w-px"
        />
      )}
      <div className="relative flex items-start gap-3">
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-purple-600 text-white ring-8 ring-white">
          <ArrowsRightLeftIcon className="size-4" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 justify-between gap-5 pt-[5px]">
          <span className="text-content-primary text-paragraph-base line-clamp-2">
            <b className="font-semibold">{deal.buyer}</b>{' '}
            <span className="text-content-secondary font-normal">
              acquired {facilityLabel(deal.facilityCount)} from
            </span>{' '}
            <b className="font-semibold">{deal.seller}</b>
          </span>
          {date && (
            <time
              dateTime={deal.date}
              className="text-content-secondary text-label-xs pt-0.5 whitespace-nowrap"
            >
              {date}
            </time>
          )}
        </span>
      </div>
    </li>
  );
}

FeedRow.propTypes = {
  deal: PropTypes.shape({
    buyer: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
    facilityCount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default function HomeAcquisitionsCta({ to = '/acquisitions' }) {
  const deals = RECENT_DEALS;

  return (
    <section className="bg-background-secondary w-full px-4 pb-8 font-sans sm:px-6 lg:px-8 xl:px-0">
      <div className="mx-auto max-w-5xl">
        <Heading level={2} className="text-heading-lg font-semibold">
          Latest Ownership Changes
        </Heading>
        <p className="text-content-primary text-paragraph-base mt-1.5">
          Facility acquisitions and ownership transitions, as reported to CMS.
        </p>

        <div className="mt-5">
          <LayoutCard>
            {deals.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-content-primary text-label-base">
                  No ownership changes recorded in the last {WINDOW_DAYS} days
                </p>
                <p className="text-content-secondary text-paragraph-sm mt-1">
                  New filings are added as CMS sources are processed.
                </p>
              </div>
            ) : (
              <ul className="-mb-6 list-none">
                {deals.map((deal, i) => (
                  <FeedRow
                    key={deal.id}
                    deal={deal}
                    isLast={i === deals.length - 1}
                  />
                ))}
              </ul>
            )}

            <AcquisitionsCtaBanner
              to={to}
              label="View all ownership changes"
              className="mt-6"
            >
              <b className="text-content-primary text-heading-sm mr-1">
                {TOTAL_CHANGES}
              </b>
              ownership {TOTAL_CHANGES === 1 ? 'change' : 'changes'} in the last{' '}
              {WINDOW_DAYS} days
            </AcquisitionsCtaBanner>
          </LayoutCard>
        </div>
      </div>
    </section>
  );
}

HomeAcquisitionsCta.propTypes = {
  to: PropTypes.string,
};
