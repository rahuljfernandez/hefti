import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import RealEstateHighlights from '../../organism/realEstateHighlights';
import PropertyFootprint from '../../organism/propertyFootprint';
import { buildStateFootprint } from '../../../../lib/stateRealEstateMetrics';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Property Details tab (see ownerPropertyDetailsTab.jsx):
 * three sections — Real Estate Highlights, Property Footprint, and the Largest
 * Related-Party Holdings table. The holdings table lands in its own follow-up
 * branch, so it renders as a placeholder for now.
 *
 * `items`/`status` mirror the other state tabs so the call site in StatesProfile
 * stays uniform. The section builders take `items` as their `source`; today they
 * fall back to mock data, so nothing is threaded in yet.
 */

export default function StateRealEstateTab() {
  return (
    <section>
      <RealEstateHighlights />

      <PropertyFootprint
        data={buildStateFootprint()}
        mapLabel="Map of the state's nursing home facilities. Related-party owned facilities are highlighted when the toggle is on."
      />

      <section>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Largest Related-Party Holdings
        </Heading>
        <p className="text-paragraph-sm text-content-secondary">
          This section is under development.
        </p>
      </section>
    </section>
  );
}

StateRealEstateTab.propTypes = {
  items: PropTypes.object,
  status: PropTypes.string,
};
