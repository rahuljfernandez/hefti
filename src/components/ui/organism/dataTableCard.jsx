import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LayoutCard from '../atom/layout-card';
import DataTable from '../molecule/dataTable';

/**
 * A DataTable wrapped in the standard card, with an optional footer link below
 * it (the "view all" affordance the home industry lists use). The section
 * heading lives with the caller, matching the other Real Estate tab sections.
 */
export default function DataTableCard({
  columns,
  rows,
  showRank = true,
  caption,
  footerLink,
}) {
  return (
    <>
      <LayoutCard>
        <DataTable
          columns={columns}
          rows={rows}
          showRank={showRank}
          caption={caption}
        />
      </LayoutCard>

      {footerLink && (
        <div className="pt-4 text-center">
          <Link
            to={footerLink.to}
            className="focus-ring-light text-paragraph-base rounded-sm text-blue-700 underline hover:text-blue-800"
          >
            {footerLink.label}
          </Link>
        </div>
      )}
    </>
  );
}

DataTableCard.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  showRank: PropTypes.bool,
  caption: PropTypes.string,
  footerLink: PropTypes.shape({
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};
