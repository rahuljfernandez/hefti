import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import StatHighlightsGrid from '../molecule/statHighlightsGrid';
import { buildPortfolioHighlights } from '../../../lib/ownerPropertyMetrics';

/**
 * Real Estate Highlights — the first section of the owner Property Details tab.
 *
 * Thin wrapper: formats the owner's real estate summary into cards and hands them
 * to the shared StatHighlightsGrid. The tab derives `summary` from the owner's
 * linked facilities and renders an empty state when there is none, so this
 * component can assume it has one.
 */
export default function PortfolioHighlights({ summary }) {
  const { primary, supporting } = buildPortfolioHighlights(summary);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Real Estate Highlights
      </Heading>
      <StatHighlightsGrid primary={primary} supporting={supporting} />
    </section>
  );
}

PortfolioHighlights.propTypes = {
  summary: PropTypes.object.isRequired,
};
