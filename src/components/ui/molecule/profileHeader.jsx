import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import HeftiResearcherCTA from './heftiResearcherCTA';
import YearSelector from './yearSelector';
import { ShareWidget } from './shareability';

/**
 * Header atop the facility and owner profile pages. Renders the subject title,
 * an ownership-type badge, and an optional data-freshness line on the left; a
 * data-year selector, the export ShareWidget, and the HEFTI Researcher CTA on
 * the right. Built on the Tailwind Catalyst Heading and Badge primitives.
 *
 * The export widget is caller-driven: each page composes its own share
 * categories and passes them straight through, so the header owns no export
 * logic — it only lays the controls out beside the year selector.
 *
 * Props:
 *  - title:          profile subject name, shown as the H1
 *  - ownershipType:  label rendered inside the badge
 *  - freshness:      "Data as of …" node; hidden when falsy
 *  - func:           maps ownershipType to a Badge color
 *  - onClick:        opens the HEFTI Researcher chat
 *  - subjectType:    'owner' | 'facility', tunes the CTA copy (default 'owner')
 *  - years:          data years for the selector; omit to hide it
 *  - selectedYear:   currently selected year (controlled)
 *  - onYearChange:   called with the newly selected year
 *  - shareCategories: ShareWidget category descriptors; omit to hide the widget
 */
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
  shareCategories,
}) {
  // Hide the controls row entirely when there's neither a year selector nor a widget.
  const hasControls = years?.length > 0 || shareCategories?.length > 0;

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
            {shareCategories?.length > 0 && (
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
  shareCategories: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
};
