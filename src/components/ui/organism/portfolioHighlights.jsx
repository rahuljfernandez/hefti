import React from 'react';
import PropTypes from 'prop-types';
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
    <StatHighlightsGrid
      title="Portfolio Highlights"
      primary={primary}
      supporting={supporting}
    />
  );
}

PortfolioHighlights.propTypes = {
  source: PropTypes.object,
};
