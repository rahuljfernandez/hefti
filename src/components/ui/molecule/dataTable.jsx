import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Config-driven ranked table: the caller supplies a `columns` array and
 * display-ready `rows`, and this maps rows × columns onto a real <table>.
 *
 * Each column owns its own header, alignment, and a `cell(row, index)` renderer,
 * so a cell can return anything — plain text, a Link, an emphasized figure, an
 * inline bar. The same column objects also carry the CSV fields (`csvHeader`,
 * `csv`) that DataTableCard reads for export; this component ignores them.
 *
 * `showRank` prepends a 1-based Rank column derived from row order, since every
 * ranked table wants the same leading position column.
 *
 * columns: [{ key, header, align?, cell, csvHeader?, csv? }]
 * rows:    display-ready objects, each with a unique `id`
 */
const alignClass = { left: 'text-left', right: 'text-right' };

const RANK_COLUMN = {
  key: '__rank',
  header: 'Rank',
  align: 'left',
  cell: (_row, index) => index + 1,
};

export default function DataTable({ columns, rows, showRank = true, caption }) {
  const allColumns = showRank ? [RANK_COLUMN, ...columns] : columns;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-border-primary border-b">
            {allColumns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  'text-label-sm text-content-secondary px-4 py-3 font-medium',
                  alignClass[col.align] ?? 'text-left',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border-primary divide-y">
          {rows.map((row, index) => (
            <tr key={row.id}>
              {allColumns.map((col) => (
                <td
                  key={col.key}
                  className={clsx(
                    'text-paragraph-sm text-core-black px-4 py-4 align-top',
                    alignClass[col.align] ?? 'text-left',
                  )}
                >
                  {col.cell(row, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node,
      align: PropTypes.oneOf(['left', 'right']),
      cell: PropTypes.func.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  showRank: PropTypes.bool,
  caption: PropTypes.string,
};
