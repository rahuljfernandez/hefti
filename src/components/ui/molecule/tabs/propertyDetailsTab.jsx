import React from 'react';
import PropTypes from 'prop-types';
import PropertyHighlights from '../../organism/propertyHighlights';
import PropertyLocationMap from '../../organism/propertyLocationMap';
import { RelatedPartyBanner } from '../../organism/propertyFlagBanners';
import {
  buildRelatedPartyFlag,
  buildPropertyHighlights,
  buildKeyFinancialsMeta,
  buildKeyFinancialStats,
  buildLocationCoordinates,
  buildLocationFields,
} from '../../../../lib/propertyMetrics';

/**
 * Property Details tab content.
 *
 * A possible related-party ownership banner, then two sections:
 * - Property Highlights (owner fields + Key Financials stat cards)
 * - Location Information (property map + address fields)
 *
 * `status` mirrors the other tabs so the owner and state contexts can slot in
 * without reshaping the call site. Only 'facility' renders content today.
 *
 * `items` is the whole facility record: the Realie parcel columns are flattened
 * onto it, so the builders take the record rather than a property object.
 */
export default function PropertyDetailsTab({ status, items }) {
  if (status !== 'facility') {
    return (
      <p className="text-paragraph-sm text-content-secondary">
        This section is under development.
      </p>
    );
  }

  const relatedParty = buildRelatedPartyFlag(items);
  const highlights = buildPropertyHighlights(items);
  const keyFinancialsMeta = buildKeyFinancialsMeta(items);
  const keyFinancialStats = buildKeyFinancialStats(items);
  const locationFields = buildLocationFields(items);
  const coordinates = buildLocationCoordinates(items);

  return (
    <section>
      {relatedParty && (
        <div className="mt-8 flex flex-col gap-4">
          <RelatedPartyBanner match={relatedParty} />
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
    </section>
  );
}

PropertyDetailsTab.propTypes = {
  status: PropTypes.string,
  items: PropTypes.object,
};
