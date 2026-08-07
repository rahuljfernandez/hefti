import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
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
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Real Estate Highlights
      </Heading>
      <StatHighlightsGrid primary={primary} supporting={supporting} />
    </section>
  );
}

RealEstateHighlights.propTypes = {
  source: PropTypes.object,
};
