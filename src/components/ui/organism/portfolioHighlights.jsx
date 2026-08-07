import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import StatHighlightsGrid from '../molecule/statHighlightsGrid';
import { buildPortfolioHighlights } from '../../../lib/ownerPropertyMetrics';

/**
 * Portfolio Highlights — the first section of the owner Property Details tab.
 *
 * Thin wrapper: builds the owner's figures and hands them to the shared
 * StatHighlightsGrid. `source` is optional; the builder falls back to mock data
 * until the property API lands.
 */
export default function PortfolioHighlights({ source }) {
  const { primary, supporting } = buildPortfolioHighlights(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Portfolio Highlights
      </Heading>
      <StatHighlightsGrid primary={primary} supporting={supporting} />
    </section>
  );
}

PortfolioHighlights.propTypes = {
  source: PropTypes.object,
};
