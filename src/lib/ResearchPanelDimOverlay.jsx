import React from 'react';
import clsx from 'clsx';
import { PANEL_DIM_OVERLAY_Z_CLASS } from './researchPanelAccent';

export default function ResearchPanelDimOverlay() {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'bg-core-white/70 pointer-events-none absolute inset-0 transition-opacity',
        PANEL_DIM_OVERLAY_Z_CLASS,
      )}
    />
  );
}
