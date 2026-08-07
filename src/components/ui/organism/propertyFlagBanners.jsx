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
 * detail subsections, with the icon and subtitle slots filled in — and hand
 * their rows to ListContainer like every other list in the app.
 *
 * `panelClassName=""` clears the card's default panel padding: ListContainerFlush
 * pads each row instead, so the dividers reach the card's edges.
 */

export function RelatedPartyBanner({ matches = [] }) {
  if (!matches.length) return null;

  return (
    <DisclosureCard
      icon={<ExclamationTriangleIcon className="size-5 text-amber-500" />}
      title="Possible related-party ownership"
      subtitle="The property owner appears connected to this facility's ownership network"
      panelClassName=""
    >
      <ListContainer
        items={matches}
        LayoutSelector={ListContainerFlush}
        ListContent={RelatedPartyMatch}
      />
    </DisclosureCard>
  );
}

RelatedPartyBanner.propTypes = {
  matches: PropTypes.array,
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
