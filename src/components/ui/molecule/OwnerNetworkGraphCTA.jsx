import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';

//As of 2/19 this is draft for demo purposes and to allow the click to open fullscreen sigma graph implementation.
export default function OwnerNetworkCtaBanner({ onOpen }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://hefti-data-api.ddev.site:3000/api';

  fetch(`${API_BASE_URL}/owners/id/123/network?depth=2`)
    .then((res) => res.json())
    .then((data) => console.log(data));

  return (
    <LayoutCard>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-content-primary text-lg font-semibold">
            Network analysis
          </h3>
          <p className="text-content-tertiary text-sm">
            See a detailed relationship graph for this owner.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
        >
          Open full-screen graph →
        </button>
      </div>
    </LayoutCard>
  );
}

OwnerNetworkCtaBanner.propTypes = {
  onOpen: PropTypes.func.isRequired,
};
