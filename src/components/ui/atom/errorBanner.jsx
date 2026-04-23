import React from 'react';
import PropTypes from 'prop-types';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export function ErrorBanner({ title, message }) {
  return (
    <div
      role="alert"
      className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
    >
      <ExclamationTriangleIcon
        className="mt-0.5 size-5 shrink-0 text-red-400"
        aria-hidden="true"
      />
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

export function NoResultsBanner({ term, className = '' }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 ${className}`}>
      <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-amber-500" aria-hidden="true" />
      <div>
        <p className="text-label-sm text-amber-800">No results found</p>
        {term && (
          <p className="text-paragraph-xs text-amber-700">
            No listings matched <span className="font-semibold">"{term}"</span>.
            Try a different search or filter.
          </p>
        )}
      </div>
    </div>
  );
}

NoResultsBanner.propTypes = {
  term: PropTypes.string,
  className: PropTypes.string,
};
