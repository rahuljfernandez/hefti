import React from 'react';
import PropTypes from 'prop-types';
import { getBadgeColorOwnerProfile } from '../../../lib/getBadgeColor';
import { Badge } from '../atom/badge';
import { Divider } from '../atom/divider';
import StarRating from './starRating';

//This component serves as the "Header/Basic Info" of the graph side panel.  It is used in both the Hub owner and Non-Hub owner type panels.  If in the future it needs to be styled for the Hub owner we have access to selectedNode.type === "Hub" for conditional render

export default function NetworkSidePanelCardHeader({ selectedNode }) {
  return (
    <div className="flex flex-col">
      {/*Header*/}
      <div className="bg-border-secondary border-border-primary flex h-14 items-center justify-between border-b px-4">
        <p className="text-core-black text-paragraph-base">Owner Details</p>
        <span>
          <Badge
            color={getBadgeColorOwnerProfile(
              selectedNode.meta.cms_ownership_type,
            )}
          >
            {selectedNode.meta.cms_ownership_type}
          </Badge>
        </span>
      </div>
      {/*Name*/}
      <div className="p-4">
        <p className="text-heading-xs tracking-wide">{selectedNode?.label}</p>
        <p className="text-label-base text-content-tertiary">
          {selectedNode.meta.cms_ownership_type} Owner
        </p>
      </div>
      {/*Divider*/}
      <div className="px-4">
        <Divider />
      </div>

      {/*Info*/}
      <div className="flex items-center justify-between p-4">
        <div>
          {' '}
          <StarRating rating={selectedNode.meta.star_rating} />
        </div>
        <div className="text-label-base text-content-tertiary">
          {selectedNode.meta.total_facilities} Facilities
        </div>
      </div>
    </div>
  );
}

NetworkSidePanelCardHeader.propTypes = {
  selectedNode: PropTypes.shape({
    label: PropTypes.string,
    meta: PropTypes.shape({
      cms_ownership_type: PropTypes.string,
      star_rating: PropTypes.number,
      total_facilities: PropTypes.number,
    }),
  }).isRequired,
};
