'use strict';

const crypto = require('crypto');

// Replaced at publish time by infra/cf-access/publish.sh
const SESSION_SECRET = '__AUTH_SESSION_SECRET__';

const STATIC_FILE = /\.(?:js|css|map|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|txt|json|webmanifest)$/i;

function isPublicUri(uri) {
  if (uri === '/' || uri === '/index.html') return true;
  if (uri.startsWith('/assets/')) return true;
  if (STATIC_FILE.test(uri)) return true;
  return false;
}

function tokenFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = String(cookieHeader).match(/(?:^|;\s*)hefti_access=([^;]+)/);
  return match ? match[1] : null;
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!data || typeof data.e !== 'string' || typeof data.x !== 'number') return null;
  if (Date.now() / 1000 > data.x) return null;
  return data;
}

function redirectToGate(request) {
  const next = `${request.uri}${request.querystring ? `?${request.querystring}` : ''}`;
  return {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [
        {
          key: 'Location',
          value: `/?next=${encodeURIComponent(next)}`,
        },
      ],
      'cache-control': [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  };
}

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  if (isPublicUri(request.uri)) return request;

  const cookieHeader = request.headers.cookie && request.headers.cookie[0]
    ? request.headers.cookie[0].value
    : '';
  if (verifySession(tokenFromCookie(cookieHeader))) return request;

  return redirectToGate(request);
};
