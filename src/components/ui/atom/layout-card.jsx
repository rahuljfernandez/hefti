import React from 'react';
import PropTypes from 'prop-types';
/**
 * Sourced from UI Application/Cards/Basic card,
 */

//this probably needs a more descriptive name to explain where it is used

export default function LayoutCard({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}

LayoutCard.propTypes = {
  children: PropTypes.node,
};
