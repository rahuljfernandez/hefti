export const ACCESS_COOKIE = 'hefti_access';

const EDU_GOV = /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:edu|gov)$/i;

export function isAccessGateEnabled() {
  return import.meta.env.VITE_ACCESS_GATE !== 'false';
}

export function isEduGovEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;
  const allowlist = String(import.meta.env.VITE_AUTH_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.includes(normalized)) return true;
  return EDU_GOV.test(normalized);
}

export function isPublicPath(pathname) {
  return pathname === '/' || pathname === '/index.html';
}

export function getAccessToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_COOKIE}=([^;]*)`),
  );
  return match ? match[1] : null;
}

export function setAccessToken(token, exp) {
  const maxAge = Math.max(0, Math.floor(exp - Date.now() / 1000));
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const host = window.location.hostname;
  const domain =
    host === 'heftiresearch.com' || host.endsWith('.heftiresearch.com')
      ? '; Domain=.heftiresearch.com'
      : '';
  document.cookie = `${ACCESS_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}${domain}`;
}

export function clearAccessToken() {
  document.cookie = `${ACCESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasAccessSession() {
  return Boolean(getAccessToken());
}

export function authHeaders(headers) {
  const next = new Headers(headers || undefined);
  const token = getAccessToken();
  if (token) next.set('Authorization', `Bearer ${token}`);
  return next;
}
