import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { Heading } from '../atom/heading';
import { Select } from '../atom/select';
import ChoroplethLegend from '../molecule/choroplethLegend';
import BestWorstToggle from '../molecule/bestWorstToggle';
import SimplePagination from '../molecule/simplePagination';
import StateShapeCard from '../molecule/stateShapeCard';
import { StateRankingsSkeleton } from '../atom/skeletons';
import {
  STATE_RANKING_DIMENSIONS,
  buildStateRankingCards,
} from '../../../lib/stateRankingsMetrics';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

const PAGE_SIZE = 10;

/**
 * "State Rankings" home-page section.
 *
 * A single metric-switchable grid of state-silhouette cards. The "Rank by" select
 * chooses the dimension; Best/Worst reorders (best-ranked first vs worst-first);
 * each card's silhouette and rank badge are colored by that state's choropleth
 * bucket, matching the "Explore by State" map above. Clicking a card opens the
 * facilities browse pre-filtered by state and pre-sorted by the metric.
 *
 * Fetches all five metrics from /state-metrics once on mount; switching the
 * "Rank by" dimension is then a client-side lookup (no refetch), mirroring
 * ExploreByState. Shows a skeleton while loading and a red-tinted skeleton on error.
 */
export default function StateRankingsHiLowViz() {
  const [dimId, setDimId] = useState(STATE_RANKING_DIMENSIONS[0].id);
  const [order, setOrder] = useState('best');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  /* Fetch all five metrics once; dimension switching is then a client-side lookup. */
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/state-metrics`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load state metrics');
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setPayload(json);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setPayload(null);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dim = useMemo(
    () => STATE_RANKING_DIMENSIONS.find((d) => d.id === dimId),
    [dimId],
  );

  const cards = useMemo(() => {
    const metric = payload?.metrics?.[dim.id];
    return metric ? buildStateRankingCards(metric, dim, order) : [];
  }, [payload, dim, order]);

  const totalItems = cards.length;
  const visible = expanded
    ? cards
    : cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDimChange = (event) => {
    setDimId(event.target.value);
    setPage(1);
  };

  const handleOrder = (value) => {
    setOrder(value);
    setPage(1);
  };

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Title / subtitle — left-aligned */}
      <div className="mb-6">
        <Heading level={2} className="text-heading-lg mb-2 font-semibold">
          State Rankings
        </Heading>
        <p className="text-paragraph-lg text-content-primary">
          Rankings based on cohorts of CMS measures including financial,
          staffing, and health outcomes
        </p>
      </div>

      {status !== 'ready' ? (
        <StateRankingsSkeleton error={status === 'error'} />
      ) : (
        <>
          {/* Controls: Rank by + Best/Worst on the left, legend on the right */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <label
                htmlFor="rank-by"
                className="text-label-sm text-core-black shrink-0 font-medium"
              >
                Rank by
              </label>
              <Select
                id="rank-by"
                aria-label="Rank by"
                value={dimId}
                onChange={handleDimChange}
                className="w-full sm:w-52"
              >
                {STATE_RANKING_DIMENSIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
              <BestWorstToggle value={order} onChange={handleOrder} />
            </div>

            <ChoroplethLegend />
          </div>

          {/* Card grid */}
          <ul
            role="list"
            aria-label={`States ranked by ${dim.name}`}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
          >
            {visible.map((item) => (
              <li key={item.stateCode}>
                <StateShapeCard item={item} />
              </li>
            ))}
          </ul>

          {/* Pagination (collapsed only) + expand/collapse */}
          {!expanded && (
            <SimplePagination
              currentPage={page}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() =>
                setPage((p) =>
                  Math.min(p + 1, Math.ceil(totalItems / PAGE_SIZE)),
                )
              }
            />
          )}

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              className="focus-ring-light text-label-sm inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-medium text-blue-700 hover:cursor-pointer hover:text-blue-800"
            >
              {expanded ? (
                <>
                  Collapse
                  <ChevronUpIcon aria-hidden="true" className="size-4" />
                </>
              ) : (
                <>
                  View all {totalItems}
                  <ChevronDownIcon aria-hidden="true" className="size-4" />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
