import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Heading } from '../atom/heading';
import PropertyStatCard from '../molecule/propertyStatCard';
import { buildPortfolioHighlights } from '../../../lib/ownerPropertyMetrics';

/**
 * Portfolio Highlights — the first section of the owner Property Details tab.
 *
 * Two lead emphasis cards (Related Party, Portfolio Value) over a row of three
 * plain stat cards (States, Properties, Property Owners). `source` is optional;
 * the builder falls back to mock data until the property API lands.
 */

const ICONS = { warning: ExclamationTriangleIcon };

export default function PortfolioHighlights({ source }) {
  const { emphasis, stats } = buildPortfolioHighlights(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Portfolio Highlights
      </Heading>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {emphasis.map((card) => (
          <PropertyStatCard
            key={card.id}
            label={card.label}
            value={card.value}
            aside={card.aside}
            description={card.description}
            accent={card.accent}
            icon={ICONS[card.icon]}
            emphasis
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((card) => (
          <PropertyStatCard
            key={card.id}
            label={card.label}
            value={card.value}
            description={card.description}
          />
        ))}
      </div>
    </section>
  );
}

PortfolioHighlights.propTypes = {
  source: PropTypes.object,
};
