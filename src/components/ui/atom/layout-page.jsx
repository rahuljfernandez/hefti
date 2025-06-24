/**
 * Sourced from UI Application/Containers/Full-width on mobile
 * Changed max-w to 1180 per design request
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function LayoutPage({ children }) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 xl:px-0">
      {children}
    </div>
  );
}

LayoutPage.propTypes = {
  children: PropTypes.node,
};
