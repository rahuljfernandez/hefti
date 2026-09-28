export const ACCESS_COOKIE = 'hefti_access';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailDomain(email) {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1) : '';
}

function isGmailAddress(email) {
  const domain = emailDomain(email);
  return (
    domain === 'gmail.com' ||
    domain === 'googlemail.com' ||
    domain.endsWith('.gmail.com') ||
    domain.endsWith('.googlemail.com')
  );
}

export function isAccessGateEnabled() {
  return import.meta.env.VITE_ACCESS_GATE !== 'false';
}

export function isAllowedAccessEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized || !EMAIL.test(normalized)) return false;
  const allowlist = String(import.meta.env.VITE_AUTH_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.includes(normalized)) return true;
  return !isGmailAddress(normalized);
}

export function isEduGovEmail(email) {
  return isAllowedAccessEmail(email);
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
  const host = typeof window === 'undefined' ? '' : window.location.hostname;
  const domain =
    host === 'heftiresearch.com' || host.endsWith('.heftiresearch.com')
      ? '; Domain=.heftiresearch.com'
      : '';
  document.cookie = `${ACCESS_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${domain}`;
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
