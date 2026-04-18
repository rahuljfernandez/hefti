import { useRef } from 'react';

/**
 * Provides roving-tabindex arrow-key navigation for a ARIA tablist.
 *
 * Returns:
 * - tabRefs: ref array to attach to each tab button (tabRefs.current[index])
 * - handleKeyDown: onKeyDown handler to attach to each tab button,
 *   called with (event, currentIndex)
 *
 * Handles: ArrowRight, ArrowLeft, ArrowDown, ArrowUp, Home, End
 */
export default function useTabKeyNavigation(tabs, onTabChange) {
  const tabRefs = useRef([]);

  function handleKeyDown(event, currentIndex) {
    if (!tabs.length) return;

    let nextIndex = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    onTabChange(tabs[nextIndex]);
    requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus();
    });
  }

  return { tabRefs, handleKeyDown };
}
