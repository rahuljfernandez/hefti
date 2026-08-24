import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import StatHighlightsGrid from '../molecule/statHighlightsGrid';
import { buildRealEstateHighlights } from '../../../lib/stateRealEstateMetrics';

/**
 * Real Estate Highlights — the first section of the state Real Estate tab.
 *
 * Thin wrapper: formats the state's real estate summary into cards and hands
 * them to the shared StatHighlightsGrid. The tab derives `summary` from the
 * state's facilities and renders an empty state when there is none, so this
 * component can assume it has one.
 */
export default function StateRealEstateHighlights({ summary }) {
  const { primary, supporting } = buildRealEstateHighlights(summary);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Real Estate Highlights
      </Heading>
      <StatHighlightsGrid primary={primary} supporting={supporting} />
    </section>
  );
}

StateRealEstateHighlights.propTypes = {
  summary: PropTypes.object.isRequired,
};
