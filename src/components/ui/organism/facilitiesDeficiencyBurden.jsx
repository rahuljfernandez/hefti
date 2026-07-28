import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';
import { buildDeficiencyBurdenFacilities } from '../../../lib/deficienciesMetrics';

/**
 * Facilities Driving Deficiency Burden — the owner-context deficiencies table.
 *
 * Ranks the owner's facilities by deficiency count and shows each against the
 * national average. Thin wrapper over the shared DataTableCard: the builder shapes
 * the rows, this file owns the column config and the "Load All" behavior. The
 * table starts collapsed to the worst offenders and expands in place, matching
 * OwnerPropertiesList.
 */

const INITIAL_VISIBLE = 10;

/* Deficiency count over a bar scaled to the worst facility in the set — red above
   the national average, gray at or below it. Caption is omitted while the national
   benchmark is still loading (vs_national_label null). */
function DeficiencyVsNationalCell({ row }) {
  return (
    <div>
      <p
        className={clsx(
          'text-paragraph-base font-semibold',
          row.above_national ? 'text-red-600' : 'text-core-black',
        )}
      >
        {row.deficiencies}
      </p>
      <div
        aria-hidden="true"
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className={clsx(
            'h-full rounded-full',
            row.above_national ? 'bg-red-500' : 'bg-gray-400',
          )}
          style={{ width: `${Math.round(row.bar_fraction * 100)}%` }}
        />
      </div>
      {row.vs_national_label && (
        <p className="text-paragraph-sm text-content-secondary mt-1">
          {row.vs_national_label}
        </p>
      )}
    </div>
  );
}

DeficiencyVsNationalCell.propTypes = {
  row: PropTypes.object.isRequired,
};

const columns = [
  {
    key: 'facility',
    header: 'Facility',
    flex: true,
    rowHeader: true,
    cell: (row) => (
      <Link
        to={`/facilities/${row.facility_slug}`}
        className="focus-ring-light text-paragraph-base rounded-sm text-blue-600 underline"
        style={{ textDecorationThickness: '2px', textUnderlineOffset: '2px' }}
      >
        {row.facility_name}
      </Link>
    ),
  },
  {
    key: 'state',
    header: 'State',
    width: 'w-16',
    cell: (row) => row.state,
  },
  {
    key: 'deficiencies',
    header: "Deficiencies Vs Nat'l",
    width: 'w-48',
    mobileBlock: true,
    cell: (row) => <DeficiencyVsNationalCell row={row} />,
  },
  {
    key: 'penalties',
    header: 'Penalties',
    align: 'right',
    width: 'w-24',
    cell: (row) => row.penalties,
  },
  {
    key: 'fines',
    header: 'Fines',
    align: 'right',
    width: 'w-28',
    cell: (row) => row.fine_display,
  },
];

export default function FacilitiesDeficiencyBurden({
  facilities,
  nationalBenchmarks,
  viewAllHref,
}) {
  const rows = useMemo(
    () => buildDeficiencyBurdenFacilities(facilities, nationalBenchmarks),
    [facilities, nationalBenchmarks],
  );
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, INITIAL_VISIBLE);
  const hasMore = rows.length > INITIAL_VISIBLE;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Facilities Driving Deficiency Burden
      </Heading>
      <DataTableCard
        columns={columns}
        rows={visible}
        caption="Facilities driving deficiency burden"
      />
      {/* Owner context expands the list in place; state context sends the user
          to the state-filtered facilities browse page instead. */}
      {viewAllHref
        ? hasMore && (
            <div className="pt-4 text-center">
              <Link
                to={viewAllHref}
                className="focus-ring-light text-paragraph-base rounded-sm text-blue-700 underline hover:text-blue-800"
              >
                View all {rows.length} facilities
              </Link>
            </div>
          )
        : !showAll &&
          hasMore && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="focus-ring-light text-paragraph-base cursor-pointer rounded-sm text-blue-700 underline hover:text-blue-800"
                aria-label={`Load All Facilities (${rows.length} total)`}
              >
                Load All Facilities
              </button>
            </div>
          )}
    </section>
  );
}

FacilitiesDeficiencyBurden.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.object),
  nationalBenchmarks: PropTypes.object,
  viewAllHref: PropTypes.string,
};
