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
  rank,
  outOf,
}) {
  // States show an overall rank line in place of the ownership-type badge.
  const isState = subjectType === 'state';

  return (
    <div className="bg-background-secondary my-6 flex flex-wrap gap-y-4 font-sans lg:flex-row lg:justify-between">
      <div>
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>
        {isState ? (
          rank != null && (
            <p className="text-paragraph-base text-content-secondary mt-4">
              Overall rank{' '}
              <span className="text-content-primary font-bold">#{rank}</span>
              {outOf != null && ` of ${outOf}`}
            </p>
          )
        ) : (
          <div className="mt-4 flex flex-row gap-2">
            <Badge color={func(ownershipType)}>{ownershipType}</Badge>
          </div>
        )}
        {freshness && (
          <p className="text-paragraph-base text-content-secondary mt-4">
            {freshness}
          </p>
        )}
      </div>
      <div>
        <HeftiResearcherCTA onClick={onClick} subjectType={subjectType} />
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  // Not used for states, which show a rank line instead of the badge.
  ownershipType: PropTypes.string,
  freshness: PropTypes.node,
  func: PropTypes.func,
  onClick: PropTypes.func,
  subjectType: PropTypes.oneOf(['owner', 'facility', 'state']),
  rank: PropTypes.number,
  outOf: PropTypes.number,
};
