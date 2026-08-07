/**
 * researchPanelAccent
 *
 * Visual accent state for the two researcher panels, driven by ShareWidget
 * hover. When a share category is hovered it targets a panel ('left' | 'right'
 * | 'both'); the targeted panel(s) get a highlight ring and the other is dimmed
 * by an overlay, making it clear which panel an export action will affect.
 */

/* Layering: the share widget sits above the dim overlay (z-20 > z-10) so it
   stays visible and clickable even while the panel beneath it is dimmed. */
export const SHARE_WIDGET_Z_CLASS = 'z-20';
export const PANEL_DIM_OVERLAY_Z_CLASS = 'z-10';

// Default state — nothing hovered, so neither panel is highlighted or dimmed.
const EMPTY_PANEL_ACCENT = {
  leftHighlighted: false,
  rightHighlighted: false,
  leftDimmed: false,
  rightDimmed: false,
};

/* Maps a hovered category's target to the four accent flags: highlight the
   panel(s) the export covers, dim the untouched one. 'both' (the full-session
   PDF) highlights both panels and dims neither. */
const PANEL_ACCENT_BY_TARGET = {
  left: {
    leftHighlighted: true,
    rightHighlighted: false,
    leftDimmed: false,
    rightDimmed: true,
  },
  right: {
    leftHighlighted: false,
    rightHighlighted: true,
    leftDimmed: true,
    rightDimmed: false,
  },
  both: {
    leftHighlighted: true,
    rightHighlighted: true,
    leftDimmed: false,
    rightDimmed: false,
  },
};

/* Resolves the current hover target to its accent flags; an unknown or null
   target (nothing hovered) falls back to the empty, no-accent state. */
export function getPanelAccent(target) {
  return PANEL_ACCENT_BY_TARGET[target] ?? EMPTY_PANEL_ACCENT;
}
