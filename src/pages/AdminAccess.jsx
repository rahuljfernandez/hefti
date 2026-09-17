import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/ui/atom/layout-page';
import { Heading } from '../components/ui/atom/heading';
import { API_BASE_URL, apiFetch } from '../lib/apiClient';

function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

export default function AdminAccess() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiFetch(`${API_BASE_URL}/admin/access-requests`)
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(payload.error || 'Could not load access requests.');
        }
        return payload;
      })
      .then((payload) => {
        if (!cancelled) setRows(payload.emails || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load access requests.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LayoutPage>
      <div className="py-8">
        <Heading level={1} className="text-display-xs">
          Access requests
        </Heading>
        <p className="text-paragraph-base text-content-secondary mt-2">
          People who asked for a HEFTI access code.
        </p>
        {loading ? (
          <p className="text-paragraph-base mt-8">Loading…</p>
        ) : error ? (
          <p className="text-paragraph-base mt-8 text-red-700">{error}</p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-4 font-semibold">Email</th>
                  <th className="py-2 pr-4 font-semibold">Domain</th>
                  <th className="py-2 pr-4 font-semibold">Requests</th>
                  <th className="py-2 pr-4 font-semibold">Allowed</th>
                  <th className="py-2 pr-4 font-semibold">Verified</th>
                  <th className="py-2 pr-4 font-semibold">Last request</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-4 text-content-secondary" colSpan={6}>
                      No access requests yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.email} className="border-b border-zinc-100">
                      <td className="py-2 pr-4">{row.email}</td>
                      <td className="py-2 pr-4">{row.domain || '—'}</td>
                      <td className="py-2 pr-4">{row.requests}</td>
                      <td className="py-2 pr-4">{row.allowed ? 'Yes' : 'No'}</td>
                      <td className="py-2 pr-4">
                        {row.verified_at ? formatWhen(row.verified_at) : '—'}
                      </td>
                      <td className="py-2 pr-4">{formatWhen(row.last_request)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutPage>
  );
}
