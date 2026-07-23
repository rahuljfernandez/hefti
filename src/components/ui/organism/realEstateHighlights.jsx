import React from 'react';
import PropTypes from 'prop-types';
import StatHighlightsGrid from '../molecule/statHighlightsGrid';
import { buildRealEstateHighlights } from '../../../lib/stateRealEstateMetrics';

/**
 * Real Estate Highlights — the first section of the state Real Estate tab.
 *
 * Thin wrapper: builds the state's figures and hands them to the shared
 * StatHighlightsGrid. `source` is optional; the builder falls back to mock data
 * until the state real estate API lands.
 */
export default function RealEstateHighlights({ source }) {
  const { primary, supporting } = buildRealEstateHighlights(source);

  return (
    <StatHighlightsGrid
      title="Real Estate Highlights"
      primary={primary}
      supporting={supporting}
    />
  );
}

RealEstateHighlights.propTypes = {
  source: PropTypes.object,
};
