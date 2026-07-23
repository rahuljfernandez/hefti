import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';
import FieldGrid from '../molecule/fieldGrid';
import StatFigureCard from '../molecule/statFigureCard';
import { Heading } from '../atom/heading';
import {
  buildPropertyHighlights,
  buildKeyFinancialsMeta,
  buildKeyFinancialStats,
} from '../../../lib/propertyMetrics';

/**
 * Property Highlights — the first section of the Property Details tab.
 *
 * Two blocks inside one card: the owner/parcel fields, then Key Financials
 * (transfer date and LTV as fields, the three dated figures as stat cards).
 *
 * `source` is optional; the builders fall back to placeholder data until the
 * property API lands. See lib/propertyMetrics.js.
 */
export default function PropertyHighlights({ source }) {
  const highlights = buildPropertyHighlights(source);
  const keyFinancialsMeta = buildKeyFinancialsMeta(source);
  const keyFinancialStats = buildKeyFinancialStats(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Property Highlights
      </Heading>

      <LayoutCard>
        {/* TEMPORARY — revisit once global card padding is settled. This div
            should disappear, not grow more breakpoints. */}
        <div className="py-5 sm:py-4">
          <FieldGrid fields={highlights} valueClassName="uppercase" />

          {/* Key Financials shares the card because the transfer figures only
              read correctly next to the owner they belong to. */}
          <div className="border-border-primary border-t pt-6">
            <Heading level={4} className="text-heading-xs mb-6">
              Key Financials
            </Heading>

            <FieldGrid fields={keyFinancialsMeta} valueClassName="uppercase" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {keyFinancialStats.map(({ label, value, caption }) => (
                <StatFigureCard
                  key={label}
                  label={label}
                  value={value}
                  caption={caption}
                />
              ))}
            </div>
          </div>
        </div>
      </LayoutCard>
    </section>
  );
}

PropertyHighlights.propTypes = {
  source: PropTypes.object,
};
