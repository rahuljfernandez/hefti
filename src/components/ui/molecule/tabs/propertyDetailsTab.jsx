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
  buildPropertyHighlights,
  buildKeyFinancialsMeta,
  buildKeyFinancialStats,
  buildLocationCoordinates,
  buildLocationFields,
  buildPropertyDetailSections,
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
 * `items` is the whole facility record: the Realie parcel columns are flattened
 * onto it, and the related-party flag reads the ownership network hanging off
 * it, so the builders take the record rather than a property object.
 */
export default function PropertyDetailsTab({ status, items }) {
  if (status !== 'facility') {
    return (
      <p className="text-paragraph-sm text-content-secondary">
        This section is under development.
      </p>
    );
  }

  const relatedPartyMatches = buildRelatedPartyMatches(items);
  const associatedProperties = buildAssociatedProperties();
  const highlights = buildPropertyHighlights(items);
  const keyFinancialsMeta = buildKeyFinancialsMeta(items);
  const keyFinancialStats = buildKeyFinancialStats(items);
  const locationFields = buildLocationFields(items);
  const coordinates = buildLocationCoordinates(items);
  const sections = buildPropertyDetailSections(items);
  const hasFlags =
    relatedPartyMatches.length > 0 || associatedProperties.length > 0;

  return (
    <section>
      {hasFlags && (
        <div className="mt-8 flex flex-col gap-4">
          <RelatedPartyBanner matches={relatedPartyMatches} />
          <AssociatedPropertiesBanner properties={associatedProperties} />
        </div>
      )}

      <PropertyHighlights
        highlights={highlights}
        keyFinancialsMeta={keyFinancialsMeta}
        keyFinancialStats={keyFinancialStats}
      />
      <PropertyLocationMap
        coordinates={coordinates}
        locationFields={locationFields}
      />
      <PropertyDetails sections={sections} />
    </section>
  );
}

PropertyDetailsTab.propTypes = {
  status: PropTypes.string,
  items: PropTypes.object,
};
