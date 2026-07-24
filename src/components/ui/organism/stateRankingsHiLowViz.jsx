import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { Heading } from '../atom/heading';
import ChoroplethLegend from '../molecule/choroplethLegend';
import BestWorstToggle from '../molecule/bestWorstToggle';
import SimplePagination from '../molecule/simplePagination';
import StateShapeCard from '../molecule/stateShapeCard';
import {
  STATE_RANKING_DIMENSIONS,
  buildStateRankingMetric,
  buildStateRankingCards,
} from '../../../lib/stateRankingsMetrics';

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
 * Stage 1: data comes from hardcoded placeholder values (stateRankingsMetrics.js).
 * Stage 2 swaps in the /api/state-metrics payload — its per-dimension shape already
 * matches what buildStateRankingCards consumes.
 */
export default function StateRankingsHiLowViz() {
  const [dimId, setDimId] = useState(STATE_RANKING_DIMENSIONS[0].id);
  const [order, setOrder] = useState('best');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const dim = useMemo(
    () => STATE_RANKING_DIMENSIONS.find((d) => d.id === dimId),
    [dimId],
  );

  const cards = useMemo(() => {
    const metric = buildStateRankingMetric(dim);
    return buildStateRankingCards(metric, dim, order);
  }, [dim, order]);

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
        <p className="text-paragraph-lg text-content-secondary">
          Rankings based on cohorts of CMS measures including financial, staffing,
          and health outcomes
        </p>
      </div>

      {/* Controls: Rank by + Best/Worst on the left, legend on the right */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label
            htmlFor="rank-by"
            className="text-label-sm text-content-secondary whitespace-nowrap"
          >
            Rank by
          </label>
          <div className="relative">
            <select
              id="rank-by"
              value={dimId}
              onChange={handleDimChange}
              className="focus-ring-light text-label-sm text-core-black border-border-primary appearance-none rounded-md border bg-white py-1.5 pr-8 pl-3"
            >
              {STATE_RANKING_DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-gray-500"
            />
          </div>
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
            setPage((p) => Math.min(p + 1, Math.ceil(totalItems / PAGE_SIZE)))
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
    </div>
  );
}
