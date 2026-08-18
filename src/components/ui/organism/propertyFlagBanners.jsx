import React from 'react';
import PropTypes from 'prop-types';
import {
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import DisclosureCard from '../molecule/disclosureCard';
import ListContainer, { ListContainerFlush } from './ListContainer';
import {
  RelatedPartyMatch,
  AssociatedProperty,
} from '../molecule/listContainerContent';

/**
 * The two conditional flag banners above the Property Details tab's sections.
 *
 * Each renders null unless its condition holds, so the usual facility shows
 * neither. Both reuse DisclosureCard — the same collapsed-card shell as the
 * detail subsections, with the icon and subtitle slots filled in.
 *
 * The related-party card holds a single row and takes the card's default panel
 * padding. The associated-properties card lists many, so it goes through
 * ListContainer and clears that padding with `panelClassName=""` — ListContainerFlush
 * pads each row instead, so the dividers reach the card's edges.
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

export function AssociatedPropertiesBanner({ properties = [] }) {
  if (!properties.length) return null;

  const current = properties.find((property) => property.is_current);

  return (
    <DisclosureCard
      icon={<BuildingOffice2Icon className="size-5 text-blue-600" />}
      title={`This facility has ${properties.length} associated properties`}
      subtitle={current ? `Currently viewing ${current.address}` : undefined}
      panelClassName=""
    >
      <ListContainer
        items={properties}
        LayoutSelector={ListContainerFlush}
        ListContent={AssociatedProperty}
      />
    </DisclosureCard>
  );
}

AssociatedPropertiesBanner.propTypes = {
  properties: PropTypes.array,
};
