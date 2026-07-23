import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';
import RealEstateHighlights from '../../organism/realEstateHighlights';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Property Details tab (see ownerPropertyDetailsTab.jsx):
 * three sections — Real Estate Highlights, Property Footprint, and the Largest
 * Related-Party Holdings table. Footprint and the holdings table land in their
 * own follow-up branches, so they render as placeholders for now.
 *
 * `items`/`status` mirror the other state tabs so the call site in StatesProfile
 * stays uniform. The section builders take `items` as their `source`; today they
 * fall back to mock data, so nothing is threaded in yet.
 */

const PENDING_SECTIONS = ['Property Footprint', 'Largest Related-Party Holdings'];

export default function StateRealEstateTab() {
  return (
    <section>
      <RealEstateHighlights />

      {PENDING_SECTIONS.map((title) => (
        <section key={title}>
          <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
            {title}
          </Heading>
          <p className="text-paragraph-sm text-content-secondary">
            This section is under development.
          </p>
        </section>
      ))}
    </section>
  );
}

StateRealEstateTab.propTypes = {
  items: PropTypes.object,
  status: PropTypes.string,
};
