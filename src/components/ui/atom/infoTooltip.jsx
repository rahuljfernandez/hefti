import { InformationCircleIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from './tooltip';

/**
 * Reusable Info Icon Tooltip
 *
 */

export default function InfoTooltip({ text }) {
  return (
    <div className="group relative flex items-center">
      <InformationCircleIcon className="h-5 w-5 text-zinc-400" />
      <Tooltip position="right" className="w-56">
        {text}
      </Tooltip>
    </div>
  );
}

InfoTooltip.propTypes = {
  text: PropTypes.string,
};
