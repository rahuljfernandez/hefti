import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { Badge } from './badge';

/**
 * Small status badge for metrics or features that are not available.
 */
export function UnavailableBadge() {
  return (
    <Badge color="red">
      <InformationCircleIcon className="size-3.5" aria-hidden="true" />
      Unavailable
    </Badge>
  );
}
