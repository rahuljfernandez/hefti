import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import PortfolioHighlights from '../../organism/portfolioHighlights';
import PropertyFootprint from '../../organism/propertyFootprint';
import OwnerPropertiesList from '../../organism/ownerPropertiesList';
import { NoDataBanner } from '../../atom/errorBanner';
import {
  buildOwnerProperties,
  buildPortfolioSummary,
  buildOwnerFootprint,
} from '../../../../lib/ownerPropertyMetrics';
import { PROPERTY_DATA_START_YEAR } from '../../../../lib/propertyMetrics';

/**
 * Property Details tab content for the owner context.
 *
 * Owner property details is list-shaped, not a `status` branch through the
 * facility tab's single-property organisms (see lib/ownerPropertyMetrics.js).
 * Three sections:
 * - Real Estate Highlights (summary stat cards)
 * - Property Footprint (all owner properties on a map + related-party toggle)
 * - Properties (the owner's properties as a sortable/filterable list)
 *
 * The tab stays in the tab bar year-round; a banner stands in for the sections
 * before coverage begins and on owners whose facilities matched no parcel,
 * mirroring the facility tab.
 */
export default function OwnerPropertyDetailsTab({ items, year }) {
  const properties = useMemo(() => buildOwnerProperties(items), [items]);
  const summary = useMemo(
    () => buildPortfolioSummary(properties),
    [properties],
  );
  const footprint = useMemo(() => buildOwnerFootprint(properties), [properties]);

  if (Number(year) < PROPERTY_DATA_START_YEAR) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title={`No property data for ${year}`}
          message={`Property records begin in ${PROPERTY_DATA_START_YEAR}. Switch the year to ${PROPERTY_DATA_START_YEAR} to view this owner's property details.`}
        />
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title="No property data for this owner"
          message="None of this owner's facilities could be matched to a property record."
        />
      </section>
    );
  }

  return (
    <section>
      <PortfolioHighlights summary={summary} />
      <PropertyFootprint
        data={footprint}
        mapLabel="Map of the owner's properties. Each property and its market value are listed in the Properties section below."
      />
      <OwnerPropertiesList properties={properties} />
    </section>
  );
}

OwnerPropertyDetailsTab.propTypes = {
  items: PropTypes.object,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
