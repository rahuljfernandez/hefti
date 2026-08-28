import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/* Params that re-render the page around the reader rather than taking them
   somewhere new. Changing the year or tab on a profile should leave the reader
   where they were; ?page= and the browse filters still scroll to top. */
const PRESERVE_SCROLL_PARAMS = new Set(['year', 'tab']);

function onlyPreservedParamsChanged(previous, next) {
  const before = new URLSearchParams(previous);
  const after = new URLSearchParams(next);
  const keys = new Set([...before.keys(), ...after.keys()]);

  for (const key of keys) {
    if (before.get(key) === after.get(key)) continue;
    if (!PRESERVE_SCROLL_PARAMS.has(key)) return false;
  }
  return true;
}

/**
 * Router helper that resets scroll position on route changes.
 *
 * Responsibilities:
 * - Scrolls the viewport back to the top whenever pathname or search changes
 * - Keeps cross-page navigation from preserving stale scroll offsets
 * - Holds position when only the year or tab changed on the current page
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const previous = useRef(null);

  useEffect(() => {
    const last = previous.current;
    previous.current = { pathname, search };

    if (
      last &&
      last.pathname === pathname &&
      onlyPreservedParamsChanged(last.search, search)
    ) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}
