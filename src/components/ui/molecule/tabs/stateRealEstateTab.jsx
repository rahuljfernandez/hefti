import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import StateRealEstateHighlights from '../../organism/stateRealEstateHighlights';
import RealEstateFootprint from '../../organism/realEstateFootprint';
import LargestRelatedPartyHoldings from '../../organism/largestRelatedPartyHoldings';
import { ErrorBanner, NoDataBanner } from '../../atom/errorBanner';
import {
  buildStateProperties,
  buildStateRealEstateSummary,
  buildStateFootprint,
  buildLargestHoldings,
} from '../../../../lib/stateRealEstateMetrics';
import { PROPERTY_DATA_START_YEAR } from '../../../../lib/propertyMetrics';

/**
 * Real Estate tab content for the state context.
 *
 * Mirrors the owner Real Estate tab (see ownerRealEstateTab.jsx): the rows
 * are built once here and shared by all three sections — Real Estate Highlights,
 * Real Estate Footprint, and the holdings table — so every figure counts the same
 * properties.
 *
 * `facilities` is the state's facility list the profile page already fetches for
 * its deficiencies table; there is no state real estate endpoint. `stateAbbr`
 * targets the "View all owners" link.
 *
 * The tab stays in the tab bar year-round; a banner stands in for the sections
 * before coverage begins and in states whose facilities matched no parcel.
 */
export default function StateRealEstateTab({
  facilities,
  loading,
  error,
  stateAbbr,
  year,
}) {
  const { properties, valuation } = useMemo(
    () => buildStateProperties(facilities),
    [facilities],
  );
  const summary = useMemo(
    () => buildStateRealEstateSummary(properties, valuation),
    [properties, valuation],
  );
  const footprint = useMemo(
    () => buildStateFootprint(properties),
    [properties],
  );
  const holdings = useMemo(
    () => buildLargestHoldings(properties),
    [properties],
  );

  if (Number(year) < PROPERTY_DATA_START_YEAR) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title={`No real estate data for ${year}`}
          message={`Real estate records begin in ${PROPERTY_DATA_START_YEAR}. Switch the year to ${PROPERTY_DATA_START_YEAR} to view this state's real estate.`}
        />
      </section>
    );
  }

  /* The facility list arrives empty before the fetch resolves, which is
     indistinguishable from a state with no matched parcels — and the empty state
     below asserts a conclusion, so it must not show while the answer is unknown. */
  if (loading) return null;

  if (error) {
    return (
      <section className="mt-8">
        <ErrorBanner
          title="Failed to load real estate data"
          message={`${error} Try refreshing the page.`}
        />
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="mt-8">
        <NoDataBanner
          title="No real estate data for this state"
          message="None of this state's facilities could be matched to a real estate record."
        />
      </section>
    );
  }

  return (
    <section>
      <StateRealEstateHighlights summary={summary} />

      <RealEstateFootprint
        data={footprint}
        mapLabel="Map of the state's nursing home facilities. Related-party owned facilities are highlighted when the toggle is on."
      />

      <LargestRelatedPartyHoldings rows={holdings} stateAbbr={stateAbbr} />
    </section>
  );
}

StateRealEstateTab.propTypes = {
  facilities: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  stateAbbr: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
