const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/* Keyed on year alone, ~2KB, and read by the state, owner and facility profiles
   — so without this every profile visit refetched bytes identical to the last
   one's. The promise is cached rather than the payload so pages mounting in the
   same tick share one request; a failed year drops out so it can be retried. */
const inFlight = new Map();

export function fetchNationalBenchmarks(year) {
  const key = String(year);
  if (!inFlight.has(key)) {
    inFlight.set(
      key,
      fetch(`${API_BASE_URL}/national?year=${year}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load national averages');
          return res.json();
        })
        .catch((err) => {
          inFlight.delete(key);
          throw err;
        }),
    );
  }
  return inFlight.get(key);
}
