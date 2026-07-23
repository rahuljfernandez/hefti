import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';
import { buildLargestHoldings } from '../../../lib/stateRealEstateMetrics';

/**
 * Largest Related-Party Holdings — the third section of the state Real Estate
 * tab. Thin wrapper: builds the ranked holdings and hands them to the shared
 * DataTableCard. `source` is optional; the builder falls back to mock data until
 * the state real estate API lands.
 *
 * `stateAbbr` targets the "View all owners" link at the owners browse page
 * filtered to this state.
 */
const holdingsColumns = [
  {
    key: 'owner',
    header: 'Owner',
    cell: (row) => (
      <div>
        <Link
          to={`/owners/${row.owner_slug}`}
          className="focus-ring-light text-paragraph-sm rounded-sm font-medium text-blue-700 underline hover:text-blue-800"
        >
          {row.owner_name}
        </Link>
        <p className="text-paragraph-xs text-content-secondary">
          {row.facility_label}
        </p>
      </div>
    ),
  },
  {
    key: 'related-party',
    header: (
      <span className="inline-flex items-center gap-1">
        <ExclamationTriangleIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-amber-500"
        />
        Related-Party
      </span>
    ),
    cell: (row) => (
      <span>
        <span className="font-medium text-amber-500">
          {row.related_party_count}
        </span>{' '}
        of {row.related_party_total} facilities
      </span>
    ),
  },
  {
    key: 're-value',
    header: 'RE Value',
    align: 'right',
    cell: (row) => row.re_value_display,
  },
];

export default function LargestRelatedPartyHoldings({ source, stateAbbr }) {
  const rows = buildLargestHoldings(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Largest Related-Party Holdings
      </Heading>
      <DataTableCard
        columns={holdingsColumns}
        rows={rows}
        caption="Largest Related-Party Holdings"
        footerLink={
          stateAbbr
            ? { to: `/owners?state=${stateAbbr}`, label: 'View all owners' }
            : undefined
        }
      />
    </section>
  );
}

LargestRelatedPartyHoldings.propTypes = {
  source: PropTypes.array,
  stateAbbr: PropTypes.string,
};
