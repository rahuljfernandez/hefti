import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';

/**
 * Largest Owners by Real Estate Value — the third section of the state Real
 * Estate tab. Thin wrapper: hands the ranked holdings the tab built to the
 * shared DataTableCard.
 *
 * Ranked by value rather than by related-party count, which the section was
 * originally specced for; see buildLargestHoldings for why the flag is too
 * sparse to rank on. The related-party column stays, so the flag is still
 * visible wherever it fires.
 *
 * `stateAbbr` targets the "View all owners" link at the owners browse page
 * filtered to this state.
 */
const holdingsColumns = [
  {
    key: 'owner',
    header: 'Owner',
    flex: true,
    rowHeader: true,
    cell: (row) => (
      <div>
        <Link
          to={`/nursing-homes/owners/${row.owner_slug}`}
          className="focus-ring-light text-paragraph-base rounded-sm text-blue-600 underline"
          style={{
            textDecorationThickness: '2px',
            textUnderlineOffset: '2px',
          }}
        >
          {row.owner_name}
        </Link>
        <p className="text-paragraph-sm text-content-secondary">
          {row.facility_label}
        </p>
      </div>
    ),
  },
  {
    key: 'related-party',
    label: 'Related-Party',
    width: 'w-56',
    align: 'left',
    header: (
      <span className="inline-flex items-center gap-1">
        <ExclamationTriangleIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-amber-500"
        />
        Related-Party
      </span>
    ),
    cell: (row) => (
      <span className="text-paragraph-base text-core-black">
        <span className="font-semibold">{row.related_party_count}</span>{' '}
        <span className="text-content-secondary">
          of {row.related_party_total} facilities
        </span>
      </span>
    ),
  },
  {
    key: 're-value',
    header: 'RE Value',
    align: 'right',
    width: 'w-48',
    cell: (row) => row.re_value_display,
  },
];

export default function LargestRelatedPartyHoldings({ rows, stateAbbr }) {
  if (!rows?.length) return null;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Largest Owners by Real Estate Value
      </Heading>
      <DataTableCard
        columns={holdingsColumns}
        rows={rows}
        caption="Largest Owners by Real Estate Value"
      />
      {stateAbbr && (
        <div className="pt-4 text-center">
          <Link
            to={`/nursing-homes/owners?state=${stateAbbr}`}
            className="focus-ring-light text-paragraph-base rounded-sm text-blue-700 underline hover:text-blue-800"
          >
            View all owners
          </Link>
        </div>
      )}
    </section>
  );
}

LargestRelatedPartyHoldings.propTypes = {
  rows: PropTypes.array,
  stateAbbr: PropTypes.string,
};
