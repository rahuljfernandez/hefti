import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';
import LayoutCard from '../components/ui/atom/layout-card';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import { US_STATES } from '../lib/stringFormatters';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

const PAGE_SIZE = 20;

const acquisitionsBreadcrumb = [
  { name: 'Home', to: '/nursing-homes', current: false },
  { name: 'Ownership Changes', to: '/nursing-homes/acquisitions', current: true },
];

function facilityLabel(count) {
  if (count == null) return 'facilities';
  return `${count} ${count === 1 ? 'facility' : 'facilities'}`;
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
}

function dealHeadline(deal) {
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
        <span className="font-semibold">{buyer}</span>
        <span className="text-content-secondary">
          {' '}
          acquired {facilityLabel(count)} from{' '}
        </span>
        <span className="font-semibold">{seller}</span>
      </>
    );
  }

  return (
    <>
      <span className="font-semibold">{buyer}</span>
      <span className="text-content-secondary">
        {count != null
          ? ` — ownership change, ${facilityLabel(count)}`
          : ' — ownership change'}
      </span>
    </>
  );
}

function DealRow({ deal }) {
  const date = formatDate(deal.date);
  const facilityLinks = (deal.facilities || []).filter((f) => f?.slug);

  return (
    <li className="border-border-primary border-b py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-full bg-purple-600 text-white">
          <ArrowsRightLeftIcon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-content-primary text-paragraph-base">
              {dealHeadline(deal)}
            </p>
            {date && (
              <time
                dateTime={deal.date}
                className="text-content-secondary text-label-xs whitespace-nowrap"
              >
                {date}
              </time>
            )}
          </div>

          <div className="text-content-secondary text-label-xs mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {deal.states?.length > 0 && <span>{deal.states.join(', ')}</span>}
            {deal.sourceType && (
              <span className="uppercase tracking-wide">{deal.sourceType}</span>
            )}
            {deal.stage && <span>{deal.stage.replace(/_/g, ' ')}</span>}
            {deal.sourceUrl?.startsWith('http') && (
              <a
                href={deal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:underline"
              >
                Source
              </a>
            )}
          </div>

          {facilityLinks.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {facilityLinks.slice(0, 6).map((f) => (
                <li key={f.slug}>
                  <Link
                    to={`/nursing-homes/facilities/${encodeURIComponent(f.slug)}`}
                    className="text-label-xs rounded-md bg-purple-50 px-2 py-1 text-purple-800 hover:bg-purple-100"
                  >
                    {f.name || f.ccn}
                  </Link>
                </li>
              ))}
              {facilityLinks.length > 6 && (
                <li className="text-content-secondary text-label-xs self-center">
                  +{facilityLinks.length - 6} more
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

export default function Acquisitions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stateFilter = (searchParams.get('state') || '').toUpperCase();
  const operatorFilter = searchParams.get('operator') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [operatorInput, setOperatorInput] = useState(operatorFilter);
  useEffect(() => {
    setOperatorInput(operatorFilter);
  }, [operatorFilter]);
  const [deals, setDeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const offset = (page - 1) * PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(offset));
    if (stateFilter) params.set('state', stateFilter);
    if (operatorFilter) params.set('operator', operatorFilter);
    return params.toString();
  }, [offset, stateFilter, operatorFilter]);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/ownership-changes?${queryString}`, {
          signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setDeals(Array.isArray(json?.data) ? json.data : []);
        setTotal(Number(json?.total) || 0);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err.message || 'Failed to load ownership changes.');
        setDeals([]);
        setTotal(0);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [queryString],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value == null || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    updateParams({ operator: operatorInput.trim(), page: '1' });
  }

  return (
    <div className="bg-background-secondary min-h-screen py-8 font-sans">
      <LayoutPage>
        <Breadcrumb pages={acquisitionsBreadcrumb} />
        <div className="mt-4">
          <Heading level={1} className="text-heading-md">
            Ownership Changes
          </Heading>
          <p className="text-paragraph-lg text-content-primary mt-1">
            Facility acquisitions and ownership transitions tracked across CMS,
            UCC, news, and SEC sources.
          </p>
        </div>

        <form
          onSubmit={onSubmitSearch}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-content-secondary text-label-xs">Search</span>
            <input
              type="search"
              value={operatorInput}
              onChange={(e) => setOperatorInput(e.target.value)}
              placeholder="Buyer, seller, or operator"
              className="border-border-primary text-paragraph-base focus:border-purple-600 focus:ring-purple-600 rounded-md border bg-white px-3 py-2"
            />
          </label>
          <label className="flex w-full flex-col gap-1 sm:w-40">
            <span className="text-content-secondary text-label-xs">State</span>
            <select
              value={stateFilter}
              onChange={(e) =>
                updateParams({ state: e.target.value || null, page: '1' })
              }
              className="border-border-primary text-paragraph-base focus:border-purple-600 focus:ring-purple-600 rounded-md border bg-white px-3 py-2"
            >
              <option value="">All states</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
          >
            Apply
          </button>
        </form>

        <div className="mt-6">
          <LayoutCard>
            <div className="text-content-secondary text-label-xs mb-4">
              {loading
                ? 'Loading…'
                : `${total.toLocaleString()} ownership ${total === 1 ? 'change' : 'changes'}`}
            </div>

            {loading ? (
              <ul className="divide-border-primary divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="py-5">
                    <div className="bg-background-secondary h-4 w-3/4 animate-pulse rounded" />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="text-content-primary text-label-base">
                  Ownership changes couldn&apos;t be loaded
                </p>
                <p className="text-content-secondary text-paragraph-sm mt-1">
                  {error}
                </p>
              </div>
            ) : deals.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-content-primary text-label-base">
                  No ownership changes match these filters
                </p>
              </div>
            ) : (
              <ul className="list-none">
                {deals.map((deal, i) => (
                  <DealRow key={deal.id || i} deal={deal} />
                ))}
              </ul>
            )}

            {!loading && !error && total > PAGE_SIZE && (
              <div className="border-border-primary mt-4 flex items-center justify-between border-t pt-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                  className="text-label-sm rounded-md border border-purple-200 px-3 py-1.5 text-purple-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-content-secondary text-label-xs">
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  disabled={page >= pageCount}
                  onClick={() => updateParams({ page: String(page + 1) })}
                  className="text-label-sm rounded-md border border-purple-200 px-3 py-1.5 text-purple-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </LayoutCard>
        </div>
      </LayoutPage>
    </div>
  );
}
