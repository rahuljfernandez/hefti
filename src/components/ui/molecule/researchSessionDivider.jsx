import React from 'react';

/**
 * Labeled horizontal rule marking the boundary between the on-load context
 * charts and the first AI-generated chart in the right panel.
 */
export default function ResearchSessionDivider() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div aria-hidden="true" className="bg-border-primary h-px flex-1" />
      <span className="text-paragraph-sm text-content-secondary shrink-0">
        Session start
      </span>
      <div aria-hidden="true" className="bg-border-primary h-px flex-1" />
    </div>
  );
}
