import { authHeaders } from './accessGate';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

export function apiFetch(url, options = {}) {
  const { headers, ...rest } = options;
  return fetch(url, {
    ...rest,
    headers: authHeaders(headers),
  });
}
