import { useState, useEffect } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/* Shared across every consumer so the home page's two sections (Explore by State
   and State Rankings) resolve to a single /state-metrics request. Reset to null on
   failure so a later mount can retry. */
let cachedPromise = null;

function fetchStateMetrics() {
  if (!cachedPromise) {
    cachedPromise = fetch(`${API_BASE_URL}/state-metrics`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load state metrics');
        return res.json();
      })
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }
  return cachedPromise;
}

/**
 * Fetches the full /state-metrics payload ({ metrics: { [dim]: { meta, states } } })
 * once and shares it across all callers. Each consumer gets its own render state;
 * the underlying request is deduped via a module-level cached promise.
 *
 * Returns { payload, status } where status is 'loading' | 'ready' | 'error'.
 */
export function useStateMetrics() {
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetchStateMetrics()
      .then((json) => {
        if (cancelled) return;
        setPayload(json);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setPayload(null);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { payload, status };
}
