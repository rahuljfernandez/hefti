import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Config-driven ranked table: the caller supplies a `columns` array and
 * display-ready `rows`, and this maps rows × columns onto a real <table>.
 *
 * Each column owns its own header, alignment, and a `cell(row, index)` renderer,
 * so a cell can return anything — plain text, a Link, an emphasized figure, an
 * inline bar. The table uses a fixed layout so column widths are honored: give
 * each column an explicit `width` (a Tailwind width class), and mark exactly one
 * column `flex` to take the leftover space (e.g. the name column stretches while
 * the numeric columns hold their set widths). The built-in Rank column is
 * fixed-width.
 *
 * `showRank` prepends a 1-based Rank column derived from row order, since every
 * ranked table wants the same leading position column. Mark the identifying
 * column (e.g. the name) `rowHeader` so its cell renders as `<th scope="row">`,
 * giving screen readers row context for the other cells.
 *
 * columns: [{ key, header, align?, flex?, width?, rowHeader?, cell }]
 * rows:    display-ready objects, each with a unique `id`
 */
const alignClass = { left: 'text-left', right: 'text-right' };

const RANK_COLUMN = {
  key: '__rank',
  header: 'Rank',
  align: 'left',
  width: 'w-16',
  cell: (_row, index) => index + 1,
};

export default function DataTable({ columns, rows, showRank = true, caption }) {
  const allColumns = showRank ? [RANK_COLUMN, ...columns] : columns;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-border-primary border-b">
            {allColumns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  'text-label-base text-core-black px-4 py-3 first:pl-0 last:pr-0',
                  !col.flex && 'whitespace-nowrap',
                  col.width,
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
              {allColumns.map((col) => {
                const Cell = col.rowHeader ? 'th' : 'td';
                return (
                  <Cell
                    key={col.key}
                    scope={col.rowHeader ? 'row' : undefined}
                    className={clsx(
                      'text-paragraph-base text-core-black px-4 py-4 first:pl-0 last:pr-0',
                      !col.flex && 'whitespace-nowrap',
                      col.width,
                      alignClass[col.align] ?? 'text-left',
                      col.rowHeader && 'font-normal',
                    )}
                  >
                    {col.cell(row, index)}
                  </Cell>
                );
              })}
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
      flex: PropTypes.bool,
      width: PropTypes.string,
      rowHeader: PropTypes.bool,
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
