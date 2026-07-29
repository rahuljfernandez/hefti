import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';
import DeficiencyVsNationalCell from '../molecule/deficiencyVsNationalCell';
import { buildDeficiencyBurdenFacilities } from '../../../lib/deficienciesMetrics';

/**
 * "Deficiencies by Facility" — the owner- and state-context table.
 *
 * Ranks facilities by deficiency count and shows each against the national
 * average. Thin wrapper over the shared DataTableCard: the builder shapes the
 * rows, this file owns the column config and the "load all / view all" behavior.
 * The table starts collapsed to the worst offenders; owner context expands in
 * place, state context links out to the state-filtered browse page.
 */

const INITIAL_VISIBLE = 10;

const stateColumn = {
  key: 'state',
  header: 'State',
  width: 'w-16',
  cell: (row) => row.state,
};

const ownerColumn = {
  key: 'owner',
  header: 'Owner',
  flex: true,
  cell: (row) => row.owner_name || '—',
};

/* Owner profile shows State (its facilities span states); state profile shows
   Owner instead, since every row shares the state and the column would just
   repeat it. Facility and Owner are both flex so long names wrap rather than
   overflow; the numeric columns keep their fixed widths. */
const buildColumns = (showOwner) => [
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
  showOwner ? ownerColumn : stateColumn,
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
    cell: (row) => row.penalties_display,
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
  showOwner = false,
}) {
  const rows = useMemo(
    () => buildDeficiencyBurdenFacilities(facilities, nationalBenchmarks),
    [facilities, nationalBenchmarks],
  );
  const columns = useMemo(() => buildColumns(showOwner), [showOwner]);
  const [showAll, setShowAll] = useState(false);

  if (rows.length === 0) return null;

  const visible = showAll ? rows : rows.slice(0, INITIAL_VISIBLE);
  const hasMore = rows.length > INITIAL_VISIBLE;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Deficiencies by Facility
      </Heading>
      <DataTableCard
        columns={columns}
        rows={visible}
        caption="Deficiencies by facility"
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
  showOwner: PropTypes.bool,
};
