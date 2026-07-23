import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import RealEstateHighlights from '../../organism/realEstateHighlights';
import PropertyFootprint from '../../organism/propertyFootprint';
import DataTableCard from '../../organism/dataTableCard';
import {
  buildStateFootprint,
  buildLargestHoldings,
} from '../../../../lib/stateRealEstateMetrics';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Property Details tab (see ownerPropertyDetailsTab.jsx):
 * three sections — Real Estate Highlights, Property Footprint, and the Largest
 * Related-Party Holdings table.
 *
 * `stateAbbr` is the only live input the tab needs today: it targets the "View
 * all owners" link at the owners browse page filtered to this state. The section
 * builders still fall back to mock data until the real estate endpoint lands.
 */

const holdingsColumns = [
  {
    key: 'owner',
    header: 'Owner',
    csvHeader: 'Owner',
    csv: (row) => row.owner_name,
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
    csvHeader: 'Related-Party',
    csv: (row) => `${row.related_party_count} of ${row.related_party_total}`,
    cell: (row) => (
      <span>
        <span className="text-amber-500 font-medium">
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
    csvHeader: 'RE Value',
    csv: (row) => row.re_value,
    cell: (row) => row.re_value_display,
  },
];

export default function StateRealEstateTab({ stateAbbr }) {
  return (
    <section>
      <RealEstateHighlights />

      <PropertyFootprint
        data={buildStateFootprint()}
        mapLabel="Map of the state's nursing home facilities. Related-party owned facilities are highlighted when the toggle is on."
      />

      <div className="mt-8">
        <DataTableCard
          title="Largest Related-Party Holdings"
          columns={holdingsColumns}
          rows={buildLargestHoldings()}
          csvFilename="largest-related-party-holdings.csv"
          footerLink={
            stateAbbr
              ? {
                  to: `/owners?state=${stateAbbr}`,
                  label: 'View all owners →',
                }
              : undefined
          }
        />
      </div>
    </section>
  );
}

StateRealEstateTab.propTypes = {
  stateAbbr: PropTypes.string,
};
