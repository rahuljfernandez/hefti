import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NetworkGraph from './networkGraph';

export default function OwnerNetworkGraphModal({ isOpen, onClose, ownerId }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://hefti-data-api.ddev.site:3000/api';

  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);

  //api call to grab owner network for graph
  const endpoint = useMemo(() => {
    return `${API_BASE_URL}/owners/id/${ownerId}/network?depth=2`;
  }, [API_BASE_URL, ownerId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!ownerId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const json = await res.json();

        setData(json);
        setStatus('ready');
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err?.message || 'Unknown error');
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [isOpen, endpoint, ownerId]);

  //When modal is open enbable use of keyboard espape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log('Data', data);

  return (
    <div className="fixed inset-0 z-100">
      {/* Panel */}
      <div className="absolute inset-0 flex flex-col overflow-hidden bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">
              Network graph
            </div>
            <div className="text-xs text-gray-500">
              Owner {ownerId} • shared facilities • depth=2
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex-1">
          {status === 'loading' && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-sm text-gray-600">Loading graph…</div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Couldn’t load graph
                </div>
                <div className="mt-1 text-sm text-gray-600">{error}</div>
              </div>
            </div>
          )}

          {status === 'ready' && data && <NetworkGraph data={data} />}
        </div>
      </div>
    </div>
  );
}

OwnerNetworkGraphModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
