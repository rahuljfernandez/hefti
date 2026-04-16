import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OwnerNetworkCtaBanner from './ownerNetworkGraphCTA';
import OwnerNetworkGraphModal from './ownerNetworkGraphModal';
/**
 * Small wrapper that owns the open/close state for the owner network graph.
 * Renders the CTA banner and the full-screen graph modal for the current owner.
 */
export default function OwnersNetworkGraphLauncher({ ownerId }) {
  const [graphOpen, setGraphOpen] = useState(false);

  return (
    <>
      <OwnerNetworkCtaBanner
        ownerId={ownerId}
        onOpen={() => setGraphOpen(true)}
      />

      <OwnerNetworkGraphModal
        isOpen={graphOpen}
        onClose={() => setGraphOpen(false)}
        ownerId={ownerId}
      />
    </>
  );
}

OwnersNetworkGraphLauncher.propTypes = {
  ownerId: PropTypes.string.isRequired,
};
