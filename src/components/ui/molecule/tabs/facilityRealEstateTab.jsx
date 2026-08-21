import React from 'react';
import PropTypes from 'prop-types';
import FacilityRealEstateHighlights from '../../organism/facilityRealEstateHighlights';
import FacilityRealEstateLocation from '../../organism/facilityRealEstateLocation';
import { RelatedPartyBanner } from '../../organism/realEstateFlagBanners';
import { NoDataBanner } from '../../atom/errorBanner';
import {
  buildRelatedPartyFlag,
  buildFacilityRealEstateHighlights,
  buildKeyFinancialsMeta,
  buildKeyFinancialStats,
  buildLocationCoordinates,
  buildLocationFields,
  hasPropertyData,
  PROPERTY_DATA_START_YEAR,
} from '../../../../lib/propertyMetrics';

/**
 * Real Estate tab content.
 *
 * A possible related-party ownership banner, then two sections:
 * - Real Estate Highlights (owner fields + Key Financials stat cards)
 * - Facility Location (CMS map + separately labeled facility/parcel fields)
 *
 * `items` is the whole facility record: the Realie parcel columns are flattened
 * onto it, so the builders take the record rather than a separate parcel record.
 *
 * The tab stays in the tab bar year-round; a banner stands in for the sections
 * before coverage begins and on facilities that matched no parcel.
 */
export default function FacilityRealEstateTab({ items, year }) {
  /* Ahead of the builders, which format every missing field as "N/A" — without
     this the empty cases render a full grid of them. */
  if (Number(year) < PROPERTY_DATA_START_YEAR) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title={`No real estate data for ${year}`}
          message={`Real estate records begin in ${PROPERTY_DATA_START_YEAR}. Switch the year to ${PROPERTY_DATA_START_YEAR} to view this facility's real estate.`}
        />
      </section>
    );
  }

  if (!hasPropertyData(items)) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title="No real estate data for this facility"
          message="This facility couldn't be matched to a real estate record."
        />
      </section>
    );
  }

  const relatedParty = buildRelatedPartyFlag(items);
  const highlights = buildFacilityRealEstateHighlights(items);
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

      <FacilityRealEstateHighlights
        highlights={highlights}
        keyFinancialsMeta={keyFinancialsMeta}
        keyFinancialStats={keyFinancialStats}
      />
      <FacilityRealEstateLocation
        coordinates={coordinates}
        locationFields={locationFields}
      />
    </section>
  );
}

FacilityRealEstateTab.propTypes = {
  items: PropTypes.object,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
