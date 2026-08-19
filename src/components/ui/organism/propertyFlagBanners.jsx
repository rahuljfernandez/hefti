import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import DisclosureCard from '../molecule/disclosureCard';
import { RelatedPartyMatch } from '../molecule/listContainerContent';

/**
 * The conditional flag banner above the Property Details tab's sections.
 *
 * The parent renders it only for flagged facilities. DisclosureCard supplies
 * the collapsed card shell, icon slot, and subtitle slot.
 */

export function RelatedPartyBanner({ match }) {
  return (
    <DisclosureCard
      icon={<ExclamationTriangleIcon className="size-5 text-amber-500" />}
      title="Possible related-party ownership"
      subtitle="The property titleholder matches an owner reported to CMS for this facility"
    >
      <RelatedPartyMatch item={match} />
    </DisclosureCard>
  );
}

RelatedPartyBanner.propTypes = {
  match: PropTypes.object.isRequired,
};
