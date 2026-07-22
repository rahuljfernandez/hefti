import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../../atom/heading';

/**
 * Property Details tab content for the owner context.
 *
 * Owner property details is list-shaped, not a `status` branch through the
 * facility tab's single-property organisms (see lib/ownerPropertyMetrics.js).
 * Three sections:
 * - Portfolio Highlights (summary stat cards)
 * - Property Footprint (all owner properties on a map + related-party toggle)
 * - Properties (the owner's properties as a sortable/filterable list)
 *
 * Scaffold: each section is a placeholder swapped for its organism in a later
 * branch. The `owner` record threads in once a section reads it; today the
 * builders fall back to mock data, so the tab takes no props yet.
 */
export default function OwnerPropertyDetailsTab() {
  return (
    <section>
      {/* Section 1 — Portfolio Highlights (branch 2 swaps this) */}
      <SectionPlaceholder title="Portfolio Highlights" />

      {/* Section 2 — Property Footprint (branch 3 swaps this) */}
      <SectionPlaceholder title="Property Footprint" />

      {/* Section 3 — Properties (branch 4 swaps this) */}
      <SectionPlaceholder title="Properties" />
    </section>
  );
}

function SectionPlaceholder({ title }) {
  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        {title}
      </Heading>
      <p className="text-paragraph-sm text-content-secondary">
        This section is under development.
      </p>
    </section>
  );
}

SectionPlaceholder.propTypes = {
  title: PropTypes.string.isRequired,
};
