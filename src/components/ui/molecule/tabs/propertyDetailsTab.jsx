import React from 'react';
import PropTypes from 'prop-types';
import PropertyHighlights from '../../organism/propertyHighlights';
import PropertyLocationMap from '../../organism/propertyLocationMap';
import PropertyDetails from '../../organism/propertyDetails';

/**
 * Property Details tab content.
 *
 * Three sections:
 * - Property Highlights (owner fields + Key Financials stat cards)
 * - Location Information (property map + address fields)
 * - Property Details (Financial / Building / Land disclosures)
 *
 * `status` mirrors the other tabs so the owner and state contexts can slot in
 * without reshaping the call site. Only 'facility' renders content today.
 *
 * No data prop, deliberately: the facility record this tab sits inside has
 * nothing to do with the property record it displays, so accepting `items`
 * would only look like the two were connected. When the property API lands the
 * property object arrives as a prop and threads into each section's `source`.
 */
export default function PropertyDetailsTab({ status }) {
  if (status !== 'facility') {
    return (
      <p className="text-paragraph-sm text-content-secondary">
        This section is under development.
      </p>
    );
  }

  return (
    <section>
      <PropertyHighlights />
      <PropertyLocationMap />
      <PropertyDetails />
    </section>
  );
}

PropertyDetailsTab.propTypes = {
  status: PropTypes.string,
};
