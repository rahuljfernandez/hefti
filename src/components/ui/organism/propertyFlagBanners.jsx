import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import DisclosureCard from '../molecule/disclosureCard';
import { RelatedPartyMatch } from '../molecule/listContainerContent';

/**
 * The conditional flag banner above the Property Details tab's sections.
 *
 * Renders null unless the facility is flagged, so the usual facility shows
 * nothing. Reuses DisclosureCard — the same collapsed-card shell used elsewhere
 * on the tab — with the icon and subtitle slots filled in.
 */

export function RelatedPartyBanner({ match }) {
  if (!match) return null;

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
  match: PropTypes.object,
};
