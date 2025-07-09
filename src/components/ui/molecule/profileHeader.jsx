import React from 'react';
import { Badge } from '../atom/badge';
import { Heading } from '../atom/heading';
import PropTypes from 'prop-types';
import { getBadgeColorOwnershipType } from '../../../lib/getBadgeColor';

/*Custom component using Heading and Badge from TW Catalyst UI Kit  */
/*Creates the header and badges w/ description atop profiles for Facilty or Owner*/

export default function ProfileHeader({ title, ownershipType, freshness }) {
  console.log(ownershipType);
  return (
    <div className="bg-background-secondary my-6">
      <Heading className="text-display-xs" level={1}>
        {title}
      </Heading>
      <div className="mt-4 flex flex-row gap-2">
        <Badge color={getBadgeColorOwnershipType(ownershipType)}>
          {ownershipType}
        </Badge>
      </div>
      <h3 className="text-paragraph-base text-content-secondary mt-4">
        {freshness}
      </h3>
    </div>
  );
}

ProfileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  ownershipType: PropTypes.string.isRequired,
  freshness: PropTypes.node,
};
