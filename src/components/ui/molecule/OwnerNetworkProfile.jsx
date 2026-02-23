import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OwnerNetworkCtaBanner from './OwnerNetworkGraphCTA';
import OwnerNetworkGraphModal from './OwnerNetworkGraphModal';

export default function OwnersNetworkProfile({ ownerId }) {
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

OwnersNetworkProfile.propTypes = {
  ownerId: PropTypes.string.isRequired,
};
