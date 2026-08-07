import React from 'react';
import PropTypes from 'prop-types';
import RealEstateHighlights from '../../organism/realEstateHighlights';
import PropertyFootprint from '../../organism/propertyFootprint';
import LargestRelatedPartyHoldings from '../../organism/largestRelatedPartyHoldings';
import { buildStateFootprint } from '../../../../lib/stateRealEstateMetrics';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Property Details tab (see ownerPropertyDetailsTab.jsx):
 * three sections — Real Estate Highlights, Property Footprint, and the Largest
 * Related-Party Holdings table.
 *
 * `stateAbbr` is the only live input today: it targets the "View all owners"
 * link at the owners browse page filtered to this state. The section builders
 * still fall back to mock data until the state real estate endpoint lands.
 */
export default function StateRealEstateTab({ stateAbbr }) {
  return (
    <section>
      <RealEstateHighlights />

      <PropertyFootprint
        data={buildStateFootprint()}
        mapLabel="Map of the state's nursing home facilities. Related-party owned facilities are highlighted when the toggle is on."
      />

      <LargestRelatedPartyHoldings stateAbbr={stateAbbr} />
    </section>
  );
}

StateRealEstateTab.propTypes = {
  stateAbbr: PropTypes.string,
};
