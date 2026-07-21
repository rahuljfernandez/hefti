import React from 'react';
import PropTypes from 'prop-types';
import PropertyHighlights from '../../organism/propertyHighlights';
import PropertyLocationMap from '../../organism/propertyLocationMap';
import PropertyDetails from '../../organism/propertyDetails';
import {
  RelatedPartyBanner,
  AssociatedPropertiesBanner,
} from '../../organism/propertyFlagBanners';
import {
  buildRelatedPartyMatches,
  buildAssociatedProperties,
} from '../../../../lib/propertyMetrics';

/**
 * Property Details tab content.
 *
 * Two conditional flag banners, then three sections:
 * - Possible related-party ownership / multiple associated properties (both
 *   render only when their condition holds; most facilities show neither)
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

  const relatedPartyMatches = buildRelatedPartyMatches();
  const associatedProperties = buildAssociatedProperties();
  const hasFlags =
    relatedPartyMatches.length > 0 || associatedProperties.length > 0;

  return (
    <section>
      {/* The wrapper is conditional, not just its children: an empty div would
          still contribute its mt-8 and leave a gap above Property Highlights on
          the common facility, which carries no flags at all. */}
      {hasFlags && (
        <div className="mt-8 flex flex-col gap-4">
          <RelatedPartyBanner matches={relatedPartyMatches} />
          <AssociatedPropertiesBanner properties={associatedProperties} />
        </div>
      )}

      <PropertyHighlights />
      <PropertyLocationMap />
      <PropertyDetails />
    </section>
  );
}

PropertyDetailsTab.propTypes = {
  status: PropTypes.string,
};
