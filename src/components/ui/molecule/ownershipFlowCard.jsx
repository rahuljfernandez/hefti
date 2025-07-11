import { ArrowUpIcon } from '@heroicons/react/24/solid';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sourced from Application/UI Cards/Card with header and footer
 * Trimmed out borders from the stock TW component - applied tokens
 *
 * UI container for the ownership flow diagram.
 *
 * Example:
 * <OwnershipFlowCard title="FACILITY" color="bg-orange-50">
 *   <OwnershipBox ... />
 * </OwnershipFlowCard>
 *
 */

export default function OwnershipFlowCard({ title, children, color }) {
  return (
    <div className={`overflow-hidden ${color}`}>
      {/*Header */}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-label-sm font-semibold">{title}</h3>
        {/* We use less vertical padding on card headers on desktop than on body sections */}
      </div>

      {/*Body/Main*/}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}

OwnershipFlowCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  color: PropTypes.string,
};
