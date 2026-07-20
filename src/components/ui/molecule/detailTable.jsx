import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DetailRow from '../atom/detailRow';

/**
 * The ruled label/value table used inside the Property Details disclosures.
 *
 * Two layers, both built from DetailRow:
 * - DetailTable: a single column of ruled rows
 * - DetailTableSplit: two columns divided by a vertical rule (the default
 *   export, since every current caller wants the split form)
 *
 * The split stacks to one column below `md`, where the vertical divider would
 * have nothing to divide.
 */

const rowShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
});

export function DetailTable({ rows, className }) {
  return (
    <dl className={clsx('flex flex-col', className)}>
      {rows.map(({ label, value }) => (
        <DetailRow key={label} label={label} value={value} />
      ))}
    </dl>
  );
}

DetailTable.propTypes = {
  rows: PropTypes.arrayOf(rowShape).isRequired,
  className: PropTypes.string,
};

/* The divider is a pseudo-element on the left column rather than a border, so
   it can inset from the top and bottom (inset-y-4) instead of running the full
   column height — a border would have to hug the box edges. It still hangs off
   the left column so it inherits the grid's stretch height, which means it
   spans the taller side. Columns are expected to be uneven — the mocks pair a
   value with its year across the divider, which rarely balances.

   The top border closes the table: DetailRow rules sit under each row, so
   without it the first row would float free of whatever sits above. It lives
   here rather than on DetailRow so a single column of rows doesn't get a
   doubled line where the two tables meet. */
export default function DetailTableSplit({ left, right, className }) {
  return (
    <div
      className={clsx(
        'border-border-primary grid grid-cols-1 border-t md:grid-cols-2',
        className,
      )}
    >
      <DetailTable
        rows={left}
        className="md:after:bg-border-primary relative md:pr-8 md:after:absolute md:after:inset-y-4 md:after:right-0 md:after:w-px md:after:content-['']"
      />
      <DetailTable rows={right} className="md:pl-8" />
    </div>
  );
}

DetailTableSplit.propTypes = {
  left: PropTypes.arrayOf(rowShape).isRequired,
  right: PropTypes.arrayOf(rowShape).isRequired,
  className: PropTypes.string,
};
