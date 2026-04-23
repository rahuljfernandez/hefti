import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LayoutCard from './layout-card';

/**
 * Centered retry card for owner network graph fetch failures.
 *
 * Used inside desktop and mobile graph layouts to keep the retry action
 * visually anchored over the muted error-state skeleton.
 */
export default function NetworkErrorCard({ onRetry }) {
  return (
    <div role="alert">
      <LayoutCard>
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-3 size-8 text-red-400" aria-hidden="true" />
          <p className="text-label-sm text-red-700">Unable to load graph</p>
          <p className="text-paragraph-xs mt-1 text-red-600">Network data could not be retrieved.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 cursor-pointer rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-label-sm text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      </LayoutCard>
    </div>
  );
}

NetworkErrorCard.propTypes = {
  onRetry: PropTypes.func.isRequired,
};
