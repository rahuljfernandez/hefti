import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';
import DataTable from '../molecule/dataTable';
import {
  ShareButton,
  ShareButtonRow,
  HoverReveal,
} from '../molecule/shareability';
import { downloadCsv } from '../../../lib/shareability/primitives/shareActions';

/**
 * Card chrome around a DataTable: heading, an optional "Download data as CSV"
 * button, and an optional footer link. Both share the table's `columns` as their
 * single source of truth — the CSV headers and rows are derived from each
 * column's `csvHeader` / `csv`, so the export can never drift from what renders.
 *
 * A column without a `csv` accessor is display-only and stays out of the export.
 */
export default function DataTableCard({
  title,
  columns,
  rows,
  showRank = true,
  csvFilename,
  footerLink,
}) {
  const exportColumns = columns.filter((col) => col.csv);

  function handleDownload() {
    const headers = [
      ...(showRank ? ['Rank'] : []),
      ...exportColumns.map((col) => col.csvHeader ?? ''),
    ];
    const csvRows = rows.map((row, index) => [
      ...(showRank ? [index + 1] : []),
      ...exportColumns.map((col) => col.csv(row)),
    ]);
    return downloadCsv(csvRows, csvFilename, headers);
  }

  return (
    <div className="group">
      <LayoutCard>
        <div className="flex items-center justify-between pb-4">
          <Heading level={4}>{title}</Heading>
          {csvFilename && (
            <HoverReveal>
              <ShareButtonRow>
                <ShareButton
                  icon={TableCellsIcon}
                  label="Download data as CSV"
                  onClick={handleDownload}
                />
              </ShareButtonRow>
            </HoverReveal>
          )}
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          showRank={showRank}
          caption={title}
        />

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
      </LayoutCard>
    </div>
  );
}

DataTableCard.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  showRank: PropTypes.bool,
  csvFilename: PropTypes.string,
  footerLink: PropTypes.shape({
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
};
