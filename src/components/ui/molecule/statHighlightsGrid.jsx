import React from 'react';
import PropTypes from 'prop-types';
import StatFigureCard from './statFigureCard';
import { gridColsClass } from '../../../lib/gridColumns';

/**
 * A row of `primary` headline cards over a row of `supporting` cards — the
 * 2-over-3 highlights layout. Purely presentational: it renders view-models
 * built elsewhere. The section heading is the consumer's to render.
 *
 * The supporting row splits evenly across however many cards it gets, so a
 * context that withholds one gets a full row rather than a gap.
 *
 * Usage — the consumer owns the heading:
 *
 *   const { primary, supporting } = buildRealEstateHighlights(source);
 *   <section>
 *     <Heading level={3}>Real Estate Highlights</Heading>
 *     <StatHighlightsGrid primary={primary} supporting={supporting} />
 *   </section>
 */

const cardShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  caption: PropTypes.node,
});

function Cards({ cards, cols, label }) {
  return (
    <dl
      aria-label={label}
      className={`grid grid-cols-1 gap-4 ${gridColsClass[cols] ?? gridColsClass[3]}`}
    >
      {cards.map((card) => (
        <StatFigureCard
          key={card.id}
          label={card.label}
          value={card.value}
          caption={card.caption}
        />
      ))}
    </dl>
  );
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(cardShape).isRequired,
  cols: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default function StatHighlightsGrid({ primary, supporting = [] }) {
  return (
    <>
      <Cards cards={primary} cols={2} label="Headline figures" />

      {supporting.length > 0 && (
        <div className="mt-4">
          <Cards
            cards={supporting}
            cols={supporting.length}
            label="Supporting figures"
          />
        </div>
      )}
    </>
  );
}

StatHighlightsGrid.propTypes = {
  primary: PropTypes.arrayOf(cardShape).isRequired,
  supporting: PropTypes.arrayOf(cardShape),
};
