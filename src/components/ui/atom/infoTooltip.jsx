import { InformationCircleIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Reusable Info Icon Tooltip
 *
 */

export default function InfoTooltip({ text }) {
  return (
    <div className="group relative flex items-center">
      <InformationCircleIcon className="h-5 w-5 text-zinc-400" />

      <div className="pointer-events-none absolute top-1/2 left-6 z-50 hidden w-56 -translate-y-1/2 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100">
        {text}
      </div>
    </div>
  );
}

InfoTooltip.propTypes = {
  text: PropTypes.string,
};
