import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import { OWNER_PROMPTS, FACILITY_PROMPTS } from '../../../lib/researchPrompts';

/**
 * The left panel's pre-conversation welcome: a heading, a context-specific
 * intro line, and a list of example prompts (hidden below md). Selecting a
 * prompt submits it via `onSelectPrompt`.
 */
export default function ResearchEmptyState({ contextType, onSelectPrompt }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <Heading level={2} className="text-heading-lg mb-1">
        Hefti Researcher
      </Heading>
      <p className="text-paragraph-base text-content-secondary mb-6">
        {contextType === 'owner'
          ? "Ask a question about this owner's facilities, quality, staffing, or financials."
          : "Ask a question about this facility's quality, staffing, deficiencies, or ownership."}
      </p>
      <div className="hidden md:block">
        <p className="text-paragraph-sm text-content-secondary mb-3 font-medium">
          Try asking
        </p>
        <div className="flex flex-col items-start gap-2">
          {(contextType === 'owner' ? OWNER_PROMPTS : FACILITY_PROMPTS).map(
            (p) => (
              <button
                key={p}
                onClick={() => onSelectPrompt(p)}
                className="text-paragraph-sm text-core-black border-border-primary bg-core-white hover:bg-background-tertiary cursor-pointer rounded-lg border px-4 py-3 text-left shadow-sm transition-colors"
              >
                {p}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

ResearchEmptyState.propTypes = {
  contextType: PropTypes.oneOf(['owner', 'facility']).isRequired,
  onSelectPrompt: PropTypes.func.isRequired,
};
