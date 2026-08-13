import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import LayoutCard from '../atom/layout-card';
import AcquisitionsCtaBanner from '../molecule/acquisitionsCtaBanner';

const WINDOW_DAYS = 90;
const FEED_LIMIT = 5;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

function facilityLabel(count) {
  if (count == null) return 'facilities';
  return `${count} ${count === 1 ? 'facility' : 'facilities'}`;
}

function formatFeedDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Build a readable one-line summary when buyer/seller/count are sparse (UCC rows). */
function dealSummary(deal) {
  const buyer =
    deal.buyer ||
    deal.operatorNames?.[0] ||
    deal.facilityNames?.[0] ||
    'An operator';
  const seller = deal.seller;
  const count =
    deal.facilityCount ??
    deal.facilities?.length ??
    deal.ccns?.length ??
    deal.facilityNames?.length ??
    null;

  if (seller) {
    return (
      <>
        <b className="font-semibold">{buyer}</b>{' '}
        <span className="text-content-secondary font-normal">
          acquired {facilityLabel(count)} from
        </span>{' '}
        <b className="font-semibold">{seller}</b>
      </>
    );
  }

  return (
    <>
      <b className="font-semibold">{buyer}</b>{' '}
      <span className="text-content-secondary font-normal">
        {count != null
          ? `— ownership change, ${facilityLabel(count)}`
          : '— ownership change'}
      </span>
    </>
  );
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
            {dealSummary(deal)}
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
    id: PropTypes.string,
    buyer: PropTypes.string,
    seller: PropTypes.string,
    facilityCount: PropTypes.number,
    date: PropTypes.string,
    operatorNames: PropTypes.arrayOf(PropTypes.string),
    facilityNames: PropTypes.arrayOf(PropTypes.string),
    ccns: PropTypes.arrayOf(PropTypes.string),
    facilities: PropTypes.array,
  }).isRequired,
  isLast: PropTypes.bool.isRequired,
};

function FeedSkeleton() {
  return (
    <ul className="-mb-6 list-none" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="relative pb-6">
          <div className="flex items-start gap-3">
            <span className="bg-background-secondary size-8 flex-none animate-pulse rounded-full" />
            <span className="bg-background-secondary mt-1 h-4 w-full max-w-md animate-pulse rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HomeAcquisitionsCta({ to = '/acquisitions' }) {
  const [deals, setDeals] = useState([]);
  const [totalChanges, setTotalChanges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [feedRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/ownership-changes?limit=${FEED_LIMIT}`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/ownership-changes/stats`, {
            signal: controller.signal,
          }),
        ]);

        if (!feedRes.ok) throw new Error(`Feed request failed: ${feedRes.status}`);
        if (!statsRes.ok) throw new Error(`Stats request failed: ${statsRes.status}`);

        const feedJson = await feedRes.json();
        const statsJson = await statsRes.json();

        setDeals(Array.isArray(feedJson?.data) ? feedJson.data : []);
        setTotalChanges(
          typeof statsJson?.last90Days === 'number'
            ? statsJson.last90Days
            : Number(feedJson?.total) || 0,
        );
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err.message || 'Failed to load ownership changes.');
        setDeals([]);
        setTotalChanges(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const bannerCount = totalChanges ?? 0;

  return (
    <section className="bg-background-secondary w-full px-4 py-8 font-sans sm:px-6 lg:px-8 xl:px-0">
      <div className="mx-auto max-w-5xl">
        <Heading level={2} className="text-heading-sm">
          Latest Ownership Changes
        </Heading>
        <p className="text-paragraph-lg text-content-primary">
          Facility acquisitions and ownership transitions.
        </p>

        <div className="mt-5">
          <LayoutCard>
            {loading ? (
              <FeedSkeleton />
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-content-primary text-label-base">
                  Ownership changes couldn&apos;t be loaded
                </p>
                <p className="text-content-secondary text-paragraph-sm mt-1">
                  Try refreshing the page.
                </p>
              </div>
            ) : deals.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-content-primary text-label-base">
                  No ownership changes recorded in the last {WINDOW_DAYS} days
                </p>
                <p className="text-content-secondary text-paragraph-sm mt-1">
                  New filings are added as sources are processed.
                </p>
              </div>
            ) : (
              <ul className="-mb-6 list-none">
                {deals.map((deal, i) => (
                  <FeedRow
                    key={deal.id || i}
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
              {loading ? (
                <span className="text-content-secondary">
                  Loading ownership changes…
                </span>
              ) : error ? (
                <span className="text-content-secondary">
                  Ownership changes unavailable.
                </span>
              ) : (
                <>
                  <b className="text-content-primary text-heading-sm mr-1">
                    {bannerCount.toLocaleString()}
                  </b>
                  ownership {bannerCount === 1 ? 'change' : 'changes'} in the last{' '}
                  {WINDOW_DAYS} days
                </>
              )}
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
