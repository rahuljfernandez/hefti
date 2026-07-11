import React from 'react';
import PropTypes from 'prop-types';
import { LinkIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import HeftiResearcherCTA from './heftiResearcherCTA';
import YearSelector from './yearSelector';
import { ShareWidget } from './shareability';
import {
  copyProfileLink,
  downloadProfileCsv,
} from '../../../lib/shareability/profileShareActions';
import { slugify } from '../../../lib/slugify';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
/*Creates the header and badges w/ description atop profiles for Facilty or Owner*/

export default function ProfileHeader({
  title,
  ownershipType,
  freshness,
  func,
  onClick,
  subjectType = 'owner',
  years,
  selectedYear,
  onYearChange,
  shareCsvRows,
  shareCsvConfig,
}) {
  /* Both profile types get the same two share actions: copy a link to the
     profile, and download its primary list as CSV (stakeholders for a facility,
     associated facilities for an owner — the caller supplies the rows + column
     config via shareCsvRows/shareCsvConfig). Built only when a config is
     passed, so the widget can be omitted (e.g. in stories). */
  /* Name the CSV after the profile subject (falls back to the config's static
     filename when there's no title). */
  const titleSlug = slugify(title);
  const csvFilename = titleSlug ? `${titleSlug}.csv` : undefined;

  const shareCategories = shareCsvConfig
    ? [
        {
          icon: LinkIcon,
          label: 'Copy link',
          tooltip: 'Copy a link to this profile',
          successLabel: 'Copied',
          emptyLabel: 'Copy failed',
          onClick: copyProfileLink,
        },
        {
          icon: TableCellsIcon,
          label: 'Download CSV',
          tooltip: shareCsvConfig.tooltip ?? 'Download as CSV',
          loadingLabel: 'Preparing…',
          successLabel: 'Downloaded',
          emptyLabel: 'No data',
          onClick: () =>
            downloadProfileCsv(shareCsvRows, shareCsvConfig, csvFilename),
        },
      ]
    : null;

  const hasControls = years?.length > 0 || shareCategories;

  return (
    <div className="bg-background-secondary my-6 flex flex-col gap-4 font-sans lg:flex-row lg:items-start lg:justify-between">
      <div className="lg:min-w-0">
        <Heading className="text-display-xs wrap-break-word" level={1}>
          {title}
        </Heading>
        <div className="mt-4 flex flex-row gap-2">
          <Badge color={func(ownershipType)}>{ownershipType}</Badge>
        </div>
        {freshness && (
          <p className="text-paragraph-base text-content-secondary mt-4">
            {freshness}
          </p>
        )}
      </div>

      {/* Right column: data-year + share controls on top, researcher CTA below.
          Left-aligned on mobile (where it wraps under the title), right-aligned
          from lg up where it sits beside the title. */}
      <div className="flex flex-col items-start gap-4 lg:shrink-0 lg:items-end">
        {hasControls && (
          <div className="flex items-center gap-3">
            {years?.length > 0 && (
              <YearSelector
                years={years}
                value={selectedYear}
                onChange={onYearChange}
              />
            )}
            {shareCategories && (
              <ShareWidget
                categories={shareCategories}
                minimizedLabel="Export"
              />
            )}
          </div>
        )}
        <HeftiResearcherCTA onClick={onClick} subjectType={subjectType} />
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  ownershipType: PropTypes.string.isRequired,
  freshness: PropTypes.node,
  func: PropTypes.func,
  onClick: PropTypes.func,
  subjectType: PropTypes.oneOf(['owner', 'facility']),
  years: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onYearChange: PropTypes.func,
  shareCsvRows: PropTypes.array,
  shareCsvConfig: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    toRow: PropTypes.func.isRequired,
    tooltip: PropTypes.string,
  }),
};
