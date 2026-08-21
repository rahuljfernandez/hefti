import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import OwnerRealEstateHighlights from '../../organism/ownerRealEstateHighlights';
import RealEstateFootprint from '../../organism/realEstateFootprint';
import OwnerRealEstateList from '../../organism/ownerRealEstateList';
import { NoDataBanner } from '../../atom/errorBanner';
import {
  buildOwnerProperties,
  buildPortfolioSummary,
  buildOwnerFootprint,
} from '../../../../lib/ownerPropertyMetrics';
import { PROPERTY_DATA_START_YEAR } from '../../../../lib/propertyMetrics';

/**
 * Real Estate tab content for the owner context.
 *
 * Owner real estate is list-shaped, not a `status` branch through the
 * facility tab's single-parcel components (see lib/ownerPropertyMetrics.js).
 * Three sections:
 * - Real Estate Highlights (summary stat cards)
 * - Real Estate Footprint (all holdings on a map + related-party toggle)
 * - Real Estate Holdings (the owner's holdings as a sortable/filterable list)
 *
 * The tab stays in the tab bar year-round; a banner stands in for the sections
 * before coverage begins and on owners whose facilities matched no parcel,
 * mirroring the facility tab.
 */
export default function OwnerRealEstateTab({ items, year }) {
  const properties = useMemo(() => buildOwnerProperties(items), [items]);
  const summary = useMemo(
    () => buildPortfolioSummary(properties),
    [properties],
  );
  const footprint = useMemo(
    () => buildOwnerFootprint(properties),
    [properties],
  );

  if (Number(year) < PROPERTY_DATA_START_YEAR) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title={`No real estate data for ${year}`}
          message={`Real estate records begin in ${PROPERTY_DATA_START_YEAR}. Switch the year to ${PROPERTY_DATA_START_YEAR} to view this owner's real estate.`}
        />
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title="No real estate data for this owner"
          message="None of this owner's facilities could be matched to a real estate record."
        />
      </section>
    );
  }

  return (
    <section>
      <OwnerRealEstateHighlights summary={summary} />
      <RealEstateFootprint
        data={footprint}
        mapLabel="Map of the owner's real estate holdings. Each holding and its market value are listed in the Real Estate Holdings section below."
      />
      <OwnerRealEstateList properties={properties} />
    </section>
  );
}

OwnerRealEstateTab.propTypes = {
  items: PropTypes.object,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
