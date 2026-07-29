import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Heading } from '../atom/heading';
import DataTableCard from './dataTableCard';
import DeficiencyVsNationalCell from '../molecule/deficiencyVsNationalCell';
import { buildEntityDeficiencyBurden } from '../../../lib/deficienciesMetrics';

/**
 * Entity Driving Deficiency Burden — the state-context ranking table, shared by
 * the chains and individual-owners variants (mirrors the home page's split).
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
    return row.entity_slug ? `/owners/${row.entity_slug}` : null;
  }
  if (linkKind === 'chain') {
    const params = new URLSearchParams({ chainName: row.entity_raw_name });
    if (stateAbbr) params.set('state', stateAbbr);
    return `/facilities?${params}`;
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
              <Link
                to={href}
                className="focus-ring-light text-paragraph-base rounded-sm text-blue-600 underline"
                style={{
                  textDecorationThickness: '2px',
                  textUnderlineOffset: '2px',
                }}
              >
                {row.entity_name}
              </Link>
            ) : (
              <p className="text-paragraph-base text-core-black font-medium">
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

  if (rows.length === 0) return null;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        {heading}
      </Heading>
      <DataTableCard columns={columns} rows={rows} caption={heading} />
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
