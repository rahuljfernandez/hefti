import React from 'react';
import PropTypes from 'prop-types';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { getBadgeColorOwnerProfile } from '../../../lib/getBadgeColor';
import { Badge } from '../atom/badge';
import { Divider } from '../atom/divider';
import StarRating from './starRating';
import clsx from 'clsx';

//This component serves as the "Header/Basic Info" of the graph side panel.  It is used in both the Hub owner and Non-Hub owner type panels.  If in the future it needs to be styled for the Hub owner we have access to selectedNode.type === "Hub" for conditional render

export default function NetworkSidePanelCardHeader({
  selectedNode,
  nonHub,
  variant = 'desktop',
}) {
  const ownerSlug = selectedNode?.meta?.slug;
  const isMobile = variant === 'mobile';

  return (
    <div className="flex flex-col">
      {/*Header*/}
      {!isMobile && (
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
      )}

      {/*Name*/}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2">
          <p
            className={clsx(
              'text-heading-xs tracking-wide',
              isMobile ? 'text-core-white' : 'text-core-black',
            )}
          >
            {selectedNode?.label}
          </p>
          {ownerSlug && nonHub && (
            <a
              href={`/owners/${ownerSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${selectedNode?.label} owner profile in a new tab`}
              className="text-content-secondary hover:text-core-black inline-flex items-center"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="px-4 pb-2">
        <p className="text-label-base text-content-tertiary">
          {selectedNode.meta.total_facilities}{' '}
          {selectedNode.meta.total_facilities === 1 ? 'Facility' : 'Facilities'}
        </p>
        <div className="pb-1">
          <Divider
            className={clsx(isMobile && 'border-border-inverse-primary')}
          />
        </div>
        {/*Star*/}
        <StarRating
          rating={selectedNode.meta.star_rating}
          ratingTextClass={isMobile ? 'text-core-white' : 'text-core-black'}
        />
      </div>
    </div>
  );
}

NetworkSidePanelCardHeader.propTypes = {
  selectedNode: PropTypes.shape({
    label: PropTypes.string,
    meta: PropTypes.shape({
      cms_ownership_type: PropTypes.string,
      slug: PropTypes.string,
      star_rating: PropTypes.number,
      total_facilities: PropTypes.number,
    }),
  }).isRequired,
  nonHub: PropTypes.bool,
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};
