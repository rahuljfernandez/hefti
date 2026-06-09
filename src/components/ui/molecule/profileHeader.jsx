import React from 'react';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import PropTypes from 'prop-types';
import HeftiResearcherCTA from './heftiResearcherCTA';
import YearSelector from './yearSelector';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
/*Creates the header and badges w/ description atop profiles for Facilty or Owner*/

export default function ProfileHeader({
  title,
  ownershipType,
  freshness,
  func,
  onClick,
  subjectType = 'owner',
  years = [],
  selectedYear,
  onYearChange,
}) {
  return (
    <div className="bg-background-secondary my-6 font-sans">
      <div className="flex items-start justify-between gap-4">
        <Heading className="text-display-xs md:max-w-[65%]" level={1}>
          {title}
        </Heading>
        {/* Desktop: CTA top-right */}
        <div className="hidden md:block">
          <HeftiResearcherCTA onClick={onClick} subjectType={subjectType} />
        </div>
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <Badge color={func(ownershipType)}>{ownershipType}</Badge>
      </div>
      {freshness && (
        <div className="mt-4 flex items-center justify-between md:justify-between">
          <p className="text-paragraph-base text-content-secondary">{freshness}</p>
          {/* Desktop: DATA YEAR inline with freshness */}
          <div className="hidden md:block">
            <YearSelector years={years} value={selectedYear} onChange={onYearChange} />
          </div>
        </div>
      )}
      {/* Mobile: CTA and DATA YEAR stacked below freshness */}
      <div className="mt-4 flex flex-col gap-3 md:hidden">
        <HeftiResearcherCTA onClick={onClick} subjectType={subjectType} />
        <YearSelector years={years} value={selectedYear} onChange={onYearChange} />
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
  years: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onYearChange: PropTypes.func,
};
