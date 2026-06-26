export const SHARE_WIDGET_Z_CLASS = 'z-20';

export const PANEL_DIM_OVERLAY_Z_CLASS = 'z-10';

const EMPTY_PANEL_ACCENT = {
  leftHighlighted: false,
  rightHighlighted: false,
  leftDimmed: false,
  rightDimmed: false,
};

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

export function getPanelAccent(target) {
  return PANEL_ACCENT_BY_TARGET[target] ?? EMPTY_PANEL_ACCENT;
}
