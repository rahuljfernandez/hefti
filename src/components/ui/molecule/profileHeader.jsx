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
}) {
  return (
    <div className="bg-background-secondary my-6 flex flex-wrap font-sans lg:flex-row lg:justify-between">
      <div>
        <Heading className="text-display-xs" level={1}>
          {title}
        </Heading>
        <div className="mt-4 flex flex-row gap-2">
          <Badge color={func(ownershipType)}>{ownershipType}</Badge>
        </div>
        <h3 className="text-paragraph-base text-content-secondary mt-4">
          {freshness}
        </h3>
      </div>
      <div>
        <HeftiResearcherCTA onClick={onClick} />
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
};
