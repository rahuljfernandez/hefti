import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Router helper that resets scroll position on route changes.
 *
 * Responsibilities:
 * - Scrolls the viewport back to the top whenever pathname or search changes
 * - Keeps cross-page navigation from preserving stale scroll offsets
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}
