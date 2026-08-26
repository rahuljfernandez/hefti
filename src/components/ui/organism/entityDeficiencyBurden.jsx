import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';
import { burdenNameLinkProps, burdenNumericColumns } from './burdenColumns';
import { buildEntityDeficiencyBurden } from '../../../lib/deficienciesMetrics';

const INITIAL_VISIBLE = 10;

/**
 * State-context "Deficiencies by …" ranking table, shared by the chains and
 * individual-owners variants (mirrors the home page's chains/owners split).
 *
 * Rows arrive pre-ranked and capped from a /state-*-burden endpoint; the builder
 * shapes them and this file owns the column config. `linkKind` sets where the
 * name links: 'owner' to the owner profile by slug, 'chain' to the state-scoped
 * facilities browse filtered to that chain (via the exact-match chainName param —
 * chain_name is what our ranking groups on). Omit for plain text.
 */

// Where a row's name links, mirroring the home page's top-chains / top-owners links.
function entityHref(row, linkKind, stateAbbr) {
  if (linkKind === 'owner') {
    return row.entity_slug ? `/nursing-homes/owners/${row.entity_slug}` : null;
  }
  if (linkKind === 'chain') {
    // No exact name → no working filter; render plain text rather than a link
    // that would drop the filter and dump the full state list.
    if (!row.entity_raw_name) return null;
    const params = new URLSearchParams({ chainName: row.entity_raw_name });
    if (stateAbbr) params.set('state', stateAbbr);
    return `/nursing-homes/facilities?${params}`;
  }
  return null;
}

function buildColumns(nameHeader, linkKind, stateAbbr) {
  return [
    {
      key: 'entity',
      header: nameHeader,
      flex: true,
      rowHeader: true,
      cell: (row) => {
        const href = entityHref(row, linkKind, stateAbbr);
        return (
          <div>
            {href ? (
              <Link to={href} {...burdenNameLinkProps}>
                {row.entity_name}
              </Link>
            ) : (
              <p className="text-label-base text-core-black">
                {row.entity_name}
              </p>
            )}
            <p className="text-paragraph-sm text-content-secondary mt-1">
              {row.facilities_label}
            </p>
          </div>
        );
      },
    },
    ...burdenNumericColumns,
  ];
}

export default function EntityDeficiencyBurden({
  heading,
  nameHeader,
  entities,
  nationalBenchmarks,
  stateAbbr,
  linkKind,
}) {
  const rows = useMemo(
    () => buildEntityDeficiencyBurden(entities, nationalBenchmarks, stateAbbr),
    [entities, nationalBenchmarks, stateAbbr],
  );
  const columns = useMemo(
    () => buildColumns(nameHeader, linkKind, stateAbbr),
    [nameHeader, linkKind, stateAbbr],
  );
  const [showAll, setShowAll] = useState(false);

  if (rows.length === 0) return null;

  const visible = showAll ? rows : rows.slice(0, INITIAL_VISIBLE);
  const noun = `${nameHeader.toLowerCase()}s`;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        {heading}
      </Heading>
      <DataTableCard columns={columns} rows={visible} caption={heading} />
      {!showAll && rows.length > INITIAL_VISIBLE && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="focus-ring-light text-paragraph-base cursor-pointer rounded-sm text-blue-700 underline hover:text-blue-800"
          >
            View all {rows.length} {noun}
          </button>
        </div>
      )}
    </section>
  );
}

EntityDeficiencyBurden.propTypes = {
  heading: PropTypes.string.isRequired,
  nameHeader: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.object),
  nationalBenchmarks: PropTypes.object,
  stateAbbr: PropTypes.string,
  linkKind: PropTypes.oneOf(['chain', 'owner']),
};
