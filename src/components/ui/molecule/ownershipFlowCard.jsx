import { ArrowUpIcon } from '@heroicons/react/24/solid';
import React from 'react';
/**
 * Sourced from Application/UI Cards/Card with header and footer
 *ToDo: Will need to follow up with handling ownership percentage based data.
 */

export default function OwnershipFlowCard({ title, children }) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
      {/*Header */}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-label-sm font-semibold">{title}</h3>
        {/* We use less vertical padding on card headers on desktop than on body sections */}
      </div>

      {/*Body/Main*/}
      <div className="px-4 py-5 sm:p-6">{children}</div>

      {/*Footer ArrowUp */}
      {title !== 'OPERATOR' && (
        <div className="flex justify-center px-4 py-4 sm:px-6">
          <ArrowUpIcon className="h-5 w-5" />
          {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
        </div>
      )}
    </div>
  );
}
