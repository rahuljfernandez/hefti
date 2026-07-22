import React from 'react';
import PortfolioHighlights from '../../organism/portfolioHighlights';
import PropertyFootprint from '../../organism/propertyFootprint';
import OwnerPropertiesList from '../../organism/ownerPropertiesList';

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
 * The `owner` record threads in once a section reads it; today the builders fall
 * back to mock data, so the tab takes no props yet.
 */
export default function OwnerPropertyDetailsTab() {
  return (
    <section>
      <PortfolioHighlights />
      <PropertyFootprint />
      <OwnerPropertiesList />
    </section>
  );
}
