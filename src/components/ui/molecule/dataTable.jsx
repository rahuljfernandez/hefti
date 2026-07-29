import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useIsMobile } from '../../../hooks/useIsMobile';

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
 * Below `md` the table is too wide, so each row instead renders as a stacked card
 * (the rowHeader column is the card title, the rest are label/value pairs). Give a
 * column `label` when its `header` is JSX/an icon, since the card needs a plain
 * string; a column with `mobileBlock` renders its value full-width under the label
 * instead of right-aligned beside it (e.g. an inline bar).
 *
 * columns: [{ key, header, label?, align?, flex?, width?, rowHeader?, mobileBlock?, cell }]
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

const columnLabel = (col) =>
  col.label ?? (typeof col.header === 'string' ? col.header : '');

export default function DataTable({ columns, rows, showRank = true, caption }) {
  const isMobile = useIsMobile(768);
  const allColumns = showRank ? [RANK_COLUMN, ...columns] : columns;
  const titleColumn = columns.find((col) => col.rowHeader) ?? columns[0];
  const detailColumns = columns.filter((col) => col !== titleColumn);

  /* Below md the table is too wide, so render one stacked card per row instead
     (the rowHeader column is the title, the rest are label/value pairs). Only one
     layout mounts at a time, keyed off the md breakpoint, so cells aren't built
     twice. The list takes its accessible name from `caption`, mirroring the
     table's sr-only <caption>. */
  if (isMobile) {
    return (
      <ul aria-label={caption} className="divide-border-primary divide-y">
        {rows.map((row, index) => (
          <li key={row.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-baseline gap-2">
              {showRank && (
                <span className="text-label-base text-content-secondary shrink-0">
                  {index + 1}
                </span>
              )}
              <div className="text-paragraph-base text-core-black font-medium">
                {titleColumn.cell(row, index)}
              </div>
            </div>
            <dl className="mt-3 flex flex-col gap-2">
              {detailColumns.map((col) =>
                col.mobileBlock ? (
                  <div key={col.key}>
                    <dt className="text-paragraph-sm text-content-secondary">
                      {columnLabel(col)}
                    </dt>
                    <dd className="mt-1">{col.cell(row, index)}</dd>
                  </div>
                ) : (
                  <div
                    key={col.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-paragraph-sm text-content-secondary">
                      {columnLabel(col)}
                    </dt>
                    <dd className="text-paragraph-base text-core-black text-right">
                      {col.cell(row, index)}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </li>
        ))}
      </ul>
    );
  }

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
      label: PropTypes.string,
      align: PropTypes.oneOf(['left', 'right']),
      flex: PropTypes.bool,
      width: PropTypes.string,
      rowHeader: PropTypes.bool,
      mobileBlock: PropTypes.bool,
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
