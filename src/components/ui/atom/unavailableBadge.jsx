import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { Badge } from './badge';

export function UnavailableBadge() {
  return (
    <Badge color="red">
      <InformationCircleIcon className="size-3.5" aria-hidden="true" />
      Unavailable
    </Badge>
  );
}
