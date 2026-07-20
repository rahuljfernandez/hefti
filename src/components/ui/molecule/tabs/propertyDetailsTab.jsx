import React from 'react';
import PropTypes from 'prop-types';
import PropertyHighlights from '../../organism/propertyHighlights';

/**
 * Property Details tab content.
 *
 * Three sections, each landing in its own commit:
 * - Property Highlights (owner fields + Key Financials stat cards)
 * - Location Information (property map + address fields)
 * - Property Details (Financial / Building / Land disclosures)
 *
 * The conditional flag banners that sit above these sections — possible
 * related-party ownership, multiple associated properties — are a later branch;
 * DisclosureCard already carries the icon/subtitle props they need.
 *
 * `status` mirrors the other tabs so the owner and state contexts can slot in
 * without reshaping the call site. Only 'facility' renders content today.
 *
 * All values are placeholders until the property API lands — see the mock in
 * lib/propertyMetrics.js.
 */
export default function PropertyDetailsTab({ status }) {
  if (status !== 'facility') {
    return (
      <p className="text-muted-foreground text-sm">
        This section is under development.
      </p>
    );
  }

  return (
    <section>
      <PropertyHighlights />
    </section>
  );
}

PropertyDetailsTab.propTypes = {
  items: PropTypes.object,
  status: PropTypes.string,
};
