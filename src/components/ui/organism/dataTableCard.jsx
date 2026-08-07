import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';
import DataTable from '../molecule/dataTable';

/**
 * A DataTable wrapped in the standard card. The section heading and any footer
 * link live with the caller, matching the other Real Estate tab sections.
 */
export default function DataTableCard({ columns, rows, showRank = true, caption }) {
  return (
    <LayoutCard>
      <DataTable
        columns={columns}
        rows={rows}
        showRank={showRank}
        caption={caption}
      />
    </LayoutCard>
  );
}

DataTableCard.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  showRank: PropTypes.bool,
  caption: PropTypes.string,
};
