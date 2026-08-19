import React from 'react';
import PropTypes from 'prop-types';
import LayoutCard from '../atom/layout-card';
import FieldGrid from '../molecule/fieldGrid';
import StatFigureCard from '../molecule/statFigureCard';
import { Heading } from '../atom/heading';

/**
 * Property Highlights — the first section of the Property Details tab.
 *
 * Two blocks inside one card: owner/parcel fields followed by transfer,
 * assessment, tax, and lending metadata plus three dated valuation cards.
 *
 * Takes display-ready rows, not a record — the tab runs the builders so every
 * section on it reads one source. See lib/propertyMetrics.js.
 */
export default function PropertyHighlights({
  highlights,
  keyFinancialStats,
  keyFinancialsMeta,
}) {
  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Property Highlights
      </Heading>

      <LayoutCard>
        {/* TEMPORARY — revisit once global card padding is settled. This div
            should disappear, not grow more breakpoints. */}
        <div className="py-5 sm:py-4">
          <FieldGrid fields={highlights} />

          {/* Key Financials shares the card because the transfer figures only
              read correctly next to the owner they belong to. */}
          <div className="border-border-primary border-t pt-6">
            <Heading level={4} className="text-heading-xs mb-6">
              Key Financials
            </Heading>

            <FieldGrid fields={keyFinancialsMeta} />

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

const fieldShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
});

PropertyHighlights.propTypes = {
  highlights: PropTypes.arrayOf(fieldShape).isRequired,
  keyFinancialsMeta: PropTypes.arrayOf(fieldShape).isRequired,
  keyFinancialStats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      caption: PropTypes.node,
    }),
  ).isRequired,
};
