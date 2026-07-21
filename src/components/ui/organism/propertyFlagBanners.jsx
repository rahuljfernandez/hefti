import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  IdentificationIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import DisclosureCard from '../molecule/disclosureCard';
import { Badge } from '../atom/badge';
import { badgeConfig } from '../../../lib/getBadgeColor';

/**
 * The two conditional flag banners above the Property Details tab's sections.
 *
 * Each renders null unless its condition holds, so the usual facility shows
 * neither. Both reuse DisclosureCard — same collapsed-card shell as the detail
 * subsections, with the icon and subtitle slots filled in.
 *
 * Both take `panelClassName=""` to drop the card's default panel padding: the
 * rows below rule edge to edge, so the padding moves onto each row.
 */

/* Match types the related-party check can report. Keyed by the value the API is
   expected to send, so a new match type is one entry here rather than a branch
   at the call site. Unrecognized types render nothing. */
const MATCH_TYPES = {
  entity_name: { label: 'Entity name', icon: IdentificationIcon },
  mailing_address: { label: 'Shared mailing address', icon: MapPinIcon },
};

function MatchChip({ type }) {
  const match = MATCH_TYPES[type];
  if (!match) return null;

  const Icon = match.icon;
  return (
    <span className="border-border-primary text-paragraph-xs text-content-secondary inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {match.label}
    </span>
  );
}

MatchChip.propTypes = {
  type: PropTypes.string.isRequired,
};

const bannerRowClass =
  'border-border-primary flex items-start justify-between gap-4 border-t px-4 py-4 sm:px-6';

export function RelatedPartyBanner({ matches = [] }) {
  if (!matches.length) return null;

  return (
    <DisclosureCard
      icon={<ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />}
      title="Possible related-party ownership"
      subtitle="The property owner appears connected to this facility's ownership network"
      panelClassName=""
    >
      {matches.map((match) => {
        const badge = badgeConfig[match.cms_ownership_role];

        return (
          <div key={match.entity_slug} className={bannerRowClass}>
            <div>
              <Link
                to={`/owners/${match.entity_slug}`}
                className="focus-ring-light text-paragraph-base rounded-sm font-medium text-blue-600 underline"
              >
                {match.entity_name}
              </Link>

              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-paragraph-sm text-content-secondary">
                  Matched on
                </span>
                {match.matched_on.map((type) => (
                  <MatchChip key={type} type={type} />
                ))}
              </div>
            </div>

            {badge && (
              <Badge color={badge.color} className="shrink-0">
                {badge.label}
              </Badge>
            )}
          </div>
        );
      })}
    </DisclosureCard>
  );
}

RelatedPartyBanner.propTypes = {
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      entity_name: PropTypes.string.isRequired,
      entity_slug: PropTypes.string.isRequired,
      matched_on: PropTypes.arrayOf(PropTypes.string).isRequired,
      cms_ownership_role: PropTypes.string,
    }),
  ),
};

export function AssociatedPropertiesBanner({ properties = [] }) {
  if (!properties.length) return null;

  const current = properties.find((property) => property.is_current);

  return (
    <DisclosureCard
      icon={<BuildingOffice2Icon className="h-5 w-5 text-blue-600" />}
      title={`This facility has ${properties.length} associated properties`}
      subtitle={current ? `Currently viewing ${current.address}` : undefined}
      panelClassName=""
    >
      {properties.map((property) => (
        <div key={property.id} className={bannerRowClass}>
          <div>
            <p className="text-paragraph-base text-content-primary">
              {property.address}
            </p>

            <div className="text-paragraph-sm text-content-secondary mt-0.5 flex flex-wrap items-center gap-2">
              <span>{property.description}</span>
              {property.related_party && (
                <>
                  <span aria-hidden="true">|</span>
                  <span className="inline-flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
                    Related Party
                  </span>
                </>
              )}
            </div>
          </div>

          {/* VIEW is inert until the property API can serve a second property.
              Rendered as a span, not a link or button, so it doesn't take a
              focus stop that does nothing when a keyboard user reaches it. */}
          {property.is_current ? (
            <span className="text-label-sm text-content-secondary shrink-0 uppercase">
              Viewing
            </span>
          ) : (
            <span className="text-label-sm shrink-0 text-blue-600 uppercase">
              View
            </span>
          )}
        </div>
      ))}
    </DisclosureCard>
  );
}

AssociatedPropertiesBanner.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      description: PropTypes.string,
      related_party: PropTypes.bool,
      is_current: PropTypes.bool,
    }),
  ),
};
