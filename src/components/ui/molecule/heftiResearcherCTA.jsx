import React from 'react';
import PropTypes from 'prop-types';
import { SparklesIcon } from '@heroicons/react/20/solid';

/**
 * HeftiResearcherCTA
 *
 * A call-to-action button displayed on the Owner Profile page.
 * When clicked, it opens the HEFTI Researcher AI chat panel.
 *
 * Note the border is actually just a background in order to implement the gradient border effect
 *
 * On hover the button raises 1 px, cursor pointer, and bg is slightly blue.
 *
 * Props:
 *  - onClick: function — opens the chat panel
 *  - ownerName: string — used in the tooltip copy
 */

export default function HeftiResearcherCTA({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group max-w-[270px] rounded-xl bg-linear-to-r from-blue-600 via-blue-400 to-cyan-300 p-[1.5px] transition-all duration-200 ease-out hover:-translate-y-px hover:cursor-pointer hover:shadow-sm"
      aria-label="Open HEFTI Researcher AI chat"
    >
      <div className="flex gap-2 rounded-xl bg-white p-2 text-left transition-colors duration-200 group-hover:bg-[#f8fbff]">
        {/* Sparkle / AI icon */}
        <SparklesIcon
          className="size-5 text-blue-600 transition-colors group-hover:text-blue-600"
          aria-hidden="true"
        />

        {/* Label */}
        <p className="text-label-xs text-core-black">
          HEFTI Researcher{' '}
          <span className="text-xs font-normal">
            can help you contruct charts based on this owner.
          </span>
        </p>
      </div>
    </button>
  );
}

HeftiResearcherCTA.propTypes = {
  onClick: PropTypes.func.isRequired,
};
