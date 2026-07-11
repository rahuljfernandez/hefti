import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import HeftiResearcherCTA from './heftiResearcherCTA';
import YearSelector from './yearSelector';
import { ShareWidget } from './shareability';

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
  shareCategories,
}) {
  /* shareCategories are composed by the page (each profile owns its own export
     set) and passed straight to the ShareWidget — the header only lays them out
     next to the year selector. */
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
