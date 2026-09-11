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
export default function OwnersNetworkGraphLauncher({
  ownerId,
  year,
  years,
  onYearChange,
}) {
  const [graphOpen, setGraphOpen] = useState(false);
  const [seedOwnerId, setSeedOwnerId] = useState(null);
  const triggerRef = useRef(null);

  /* ownerId is a per-year surrogate, so the profile hands over a different one
     every time the year changes. Pinning it at open keeps a year change from
     fetching twice — once for the year, again when the profile's own refetch
     lands a new id — since the API re-resolves the owner from the year anyway. */
  const handleOpen = () => {
    setSeedOwnerId(ownerId);
    setGraphOpen(true);
  };

  return (
    <>
      <OwnerNetworkCtaBanner
        triggerRef={triggerRef}
        ownerId={ownerId}
        onOpen={handleOpen}
      />

      <OwnerNetworkGraphModal
        isOpen={graphOpen}
        onClose={() => setGraphOpen(false)}
        ownerId={seedOwnerId ?? ownerId}
        year={year}
        years={years}
        onYearChange={onYearChange}
        restoreFocusRef={triggerRef}
      />
    </>
  );
}

OwnersNetworkGraphLauncher.propTypes = {
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  year: PropTypes.number,
  years: PropTypes.arrayOf(PropTypes.number),
  onYearChange: PropTypes.func,
};
