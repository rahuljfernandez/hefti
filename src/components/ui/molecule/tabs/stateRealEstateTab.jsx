import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Property Details tab (see ownerPropertyDetailsTab.jsx):
 * three sections — Real Estate Highlights, Property Footprint, and the Largest
 * Related-Party Holdings table. This is the scaffold; each section lands in its
 * own follow-up branch, so they render as placeholders for now.
 *
 * `items`/`status` mirror the other state tabs so the call site in StatesProfile
 * stays uniform. The section builders will take `items` as their `source` once
 * they exist.
 */

const SECTIONS = [
  'Real Estate Highlights',
  'Property Footprint',
  'Largest Related-Party Holdings',
];

export default function StateRealEstateTab() {
  return (
    <section>
      {SECTIONS.map((title) => (
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
