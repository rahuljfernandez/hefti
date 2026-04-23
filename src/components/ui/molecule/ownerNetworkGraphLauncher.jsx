import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import OwnerNetworkCtaBanner from './ownerNetworkGraphCTA';
import OwnerNetworkGraphModal from './ownerNetworkGraphModal';
/**
 * Small wrapper that owns the open/close state for the owner network graph.
 *
 * Responsibilities:
 * - Renders the CTA trigger and the full-screen graph modal for the current owner
 * - Owns the open/close state for the graph experience
 * - Holds the trigger ref so the modal can restore focus on close
 */
export default function OwnersNetworkGraphLauncher({ ownerId }) {
  const [graphOpen, setGraphOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <OwnerNetworkCtaBanner
        triggerRef={triggerRef}
        ownerId={ownerId}
        onOpen={() => setGraphOpen(true)}
      />

      <OwnerNetworkGraphModal
        isOpen={graphOpen}
        onClose={() => setGraphOpen(false)}
        ownerId={ownerId}
        restoreFocusRef={triggerRef}
      />
    </>
  );
}

OwnersNetworkGraphLauncher.propTypes = {
  ownerId: PropTypes.string.isRequired,
};
