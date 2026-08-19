import React from 'react';
import PropTypes from 'prop-types';
import PropertyHighlights from '../../organism/propertyHighlights';
import PropertyLocationMap from '../../organism/propertyLocationMap';
import { RelatedPartyBanner } from '../../organism/propertyFlagBanners';
import { NoDataBanner } from '../../atom/errorBanner';
import {
  buildRelatedPartyFlag,
  buildPropertyHighlights,
  buildKeyFinancialsMeta,
  buildKeyFinancialStats,
  buildLocationCoordinates,
  buildLocationFields,
  hasPropertyData,
  PROPERTY_DATA_START_YEAR,
} from '../../../../lib/propertyMetrics';

/**
 * Property Details tab content.
 *
 * A possible related-party ownership banner, then two sections:
 * - Property Highlights (owner fields + Key Financials stat cards)
 * - Location Information (property map + address fields)
 *
 * `items` is the whole facility record: the Realie parcel columns are flattened
 * onto it, so the builders take the record rather than a property object.
 *
 * The tab stays in the tab bar year-round; a banner stands in for the sections
 * before coverage begins and on facilities that matched no parcel.
 */
export default function PropertyDetailsTab({ items, year }) {
  /* Ahead of the builders, which format every missing field as "N/A" — without
     this the empty cases render a full grid of them. */
  if (Number(year) < PROPERTY_DATA_START_YEAR) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title={`No property data for ${year}`}
          message={`Property records begin in ${PROPERTY_DATA_START_YEAR}. Switch the year to ${PROPERTY_DATA_START_YEAR} to view this facility's property details.`}
        />
      </section>
    );
  }

  if (!hasPropertyData(items)) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title="No property data for this facility"
          message="This facility couldn't be matched to a property record."
        />
      </section>
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
  items: PropTypes.object,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
