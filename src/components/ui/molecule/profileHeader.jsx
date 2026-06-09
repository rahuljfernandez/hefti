import React from 'react';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import PropTypes from 'prop-types';
import HeftiResearcherCTA from './heftiResearcherCTA';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
/*Creates the header and badges w/ description atop profiles for Facilty or Owner*/

export default function ProfileHeader({
  title,
  ownershipType,
  freshness,
  func,
  onClick,
  subjectType = 'owner',
}) {
  return (
    <div className="bg-background-secondary my-6 font-sans">
      <div className="flex items-start justify-between gap-4">
        <Heading className="text-display-xs md:max-w-[65%]" level={1}>
          {title}
        </Heading>
        <div className="hidden md:block">
          <HeftiResearcherCTA onClick={onClick} subjectType={subjectType} />
        </div>
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <Badge color={func(ownershipType)}>{ownershipType}</Badge>
      </div>
      {freshness && (
        <p className="mt-4 text-paragraph-base text-content-secondary">{freshness}</p>
      )}
      <div className="mt-4 md:hidden">
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
};
