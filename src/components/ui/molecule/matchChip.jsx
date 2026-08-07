import React from 'react';
import PropTypes from 'prop-types';
import { IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Badge } from '../atom/badge';

/**
 * A single "matched on" chip — the evidence behind a related-party match
 * (shared entity name, shared mailing address).
 *
 */

/* Keyed by the value the API is expected to send, so a new match type is one
   entry here rather than a branch at the call site. Unknown types render
   nothing — a match reason the front end doesn't recognise is better dropped
   than shown as a raw enum. */
const MATCH_TYPES = {
  entity_name: { label: 'Entity name', icon: IdentificationIcon },
  mailing_address: { label: 'Shared mailing address', icon: MapPinIcon },
};

export default function MatchChip({ type }) {
  const match = MATCH_TYPES[type];
  if (!match) return null;

  const Icon = match.icon;
  return (
    <Badge color="zinc">
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {match.label}
    </Badge>
  );
}

MatchChip.propTypes = {
  type: PropTypes.string.isRequired,
};
