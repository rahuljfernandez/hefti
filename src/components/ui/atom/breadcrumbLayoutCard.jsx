import React from 'react';
import PropTypes from 'prop-types';

/**
 * Sourced from UI Application/Cards/Basic card,
 * customized to breadcrumb layout
 * Might move this into a layout specific file/folder at a later date
 *
 */

export default function BreadcrumbLayoutCard({ children, className }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="p-4">{children}</div>
    </div>
  );
}

BreadcrumbLayoutCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
