import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';
import networkGraphSvg from '../../../assets/networkGraph.svg';

/**
 * CTA button that launches the owner network graph modal.
 *
 * Notes:
 * - Rendered as a real button so it is keyboard accessible
 * - Accepts a forwarded trigger ref so focus can return here when the modal closes
 */
export default function OwnerNetworkCtaBanner({ onOpen, triggerRef }) {
  return (
    <LayoutCard>
      <button
        ref={triggerRef}
        type="button"
        onClick={onOpen}
        className="flex w-full cursor-pointer flex-col text-left sm:flex-row sm:justify-between"
      >
        <div className="sm:max-w-2/3">
          <h3 className="text-core-black text-2xl sm:text-[40px]">
            View <span className="font-bold">ownership connections</span>
          </h3>
          <p className="text-core-black text-base sm:text-2xl">
            A network analysis of owners and affiliates. Click and engage on
            different nodes to explore quality, finance, and staffing between
            owners and facilities.
          </p>
        </div>

        <img
          src={networkGraphSvg}
          alt="Network graph preview"
          className="w-48 sm:w-auto"
        />
      </button>
    </LayoutCard>
  );
}

OwnerNetworkCtaBanner.propTypes = {
  onOpen: PropTypes.func.isRequired,
  triggerRef: PropTypes.shape({ current: PropTypes.any }),
};
