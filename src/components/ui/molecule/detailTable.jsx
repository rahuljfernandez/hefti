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

/* The divider lives on the left column rather than between the two, so it
   inherits the grid's stretch height and runs the full height of the taller
   side. Columns are expected to be uneven — the mocks pair a value with its
   year across the divider, which rarely balances. */
export default function DetailTableSplit({ left, right, className }) {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2', className)}>
      <DetailTable
        rows={left}
        className="md:border-border-primary md:border-r md:pr-8"
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
