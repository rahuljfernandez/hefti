import React from 'react';
import PropTypes from 'prop-types';
import { SparklesIcon } from '@heroicons/react/20/solid';

/**
 * CTA button for the HEFTI Researcher AI chat.
 * The gradient border is a background on the outer button with padding acting as border thickness.
 * Animation and fallback styles live in tailwind.css under `.hefti-cta-border`.
 */
export default function HeftiResearcherCTA({ onClick }) {
  return (
    // Outer element is the visible gradient border — padding = border thickness.
    // focus-visible ring only shows on keyboard nav, not mouse click.
    <button
      onClick={onClick}
      className="hefti-cta-border group max-w-[270px] rounded-xl p-[2.5px] transition-all duration-200 ease-out hover:-translate-y-px hover:cursor-pointer hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label="Open HEFTI Researcher AI chat"
    >
      {/* Inner div sits on top of the gradient background, creating the border illusion */}
      <div className="flex gap-2 rounded-[10.5px] bg-white p-2 text-left transition-colors duration-200 group-hover:bg-[#f8fbff]">
        <SparklesIcon
          className="size-5 shrink-0 text-blue-600"
          aria-hidden="true"
        />
        <p className="text-label-xs text-core-black">
          HEFTI Researcher{' '}
          <span className="text-xs font-normal">
            can help you construct charts based on this owner.
          </span>
        </p>
      </div>
    </button>
  );
}

HeftiResearcherCTA.propTypes = {
  onClick: PropTypes.func.isRequired,
};
