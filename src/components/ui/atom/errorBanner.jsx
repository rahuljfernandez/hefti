import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function ErrorBanner({ title, message }) {
  return (
    <div
      role="alert"
      className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
    >
      <ExclamationTriangleIcon className="mt-0.5 size-5 shrink-0 text-red-400" aria-hidden="true" />
      <div>
        <p className="text-label-sm text-red-700">{title}</p>
        <p className="text-paragraph-xs text-red-600">{message}</p>
      </div>
    </div>
  );
}

ErrorBanner.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
