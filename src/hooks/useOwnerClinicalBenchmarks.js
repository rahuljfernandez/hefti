import { useEffect, useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

let cachedBenchmarks = null;
let inflightRequest = null;

function fetchOwnerClinicalBenchmarks() {
  if (cachedBenchmarks) {
    return Promise.resolve(cachedBenchmarks);
  }

  if (!inflightRequest) {
    inflightRequest = fetch(
      `${API_BASE_URL}/owners/benchmarks/clinical-quality`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Benchmarks request failed (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        cachedBenchmarks = data;
        return data;
      })
      .finally(() => {
        inflightRequest = null;
      });
  }

  return inflightRequest;
}

/**
 * Loads national median/std-dev benchmarks for owner clinical quality cards.
 * Results are cached in-memory for the session so multiple tabs/panels share one request.
 */
export function useOwnerClinicalBenchmarks(enabled = true) {
  const [benchmarks, setBenchmarks] = useState(
    enabled ? cachedBenchmarks : null,
  );
  const [loading, setLoading] = useState(enabled && !cachedBenchmarks);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setBenchmarks(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (cachedBenchmarks) {
      setBenchmarks(cachedBenchmarks);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchOwnerClinicalBenchmarks()
      .then((data) => {
        if (cancelled) return;
        setBenchmarks(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setBenchmarks(null);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { benchmarks, loading, error };
}
