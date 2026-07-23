import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import StatFigureCard from './statFigureCard';

/**
 * A row of `primary` headline cards over a row of `supporting` cards. Purely
 * presentational — it renders view-models built elsewhere and holds no domain
 * knowledge, so any context (owner portfolio, state real estate, …) can feed it
 * its own figures. The section heading is the consumer's to render.
 *
 * Cards carry an `icon` string token rather than a component so callers stay
 * free of JSX; the map below is the one place that turns a token into an icon.
 * Add a token here when a new figure needs one.
 */

const ICONS = { warning: ExclamationTriangleIcon };

function Cards({ cards, columnsClassName }) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${columnsClassName}`}>
      {cards.map((card) => (
        <StatFigureCard
          key={card.id}
          label={card.label}
          value={card.value}
          aside={card.aside}
          caption={card.caption}
          accent={card.accent}
          icon={ICONS[card.icon]}
        />
      ))}
    </div>
  );
}

const cardShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aside: PropTypes.string,
  caption: PropTypes.node,
  accent: PropTypes.oneOf(['amber']),
  icon: PropTypes.string,
});

Cards.propTypes = {
  cards: PropTypes.arrayOf(cardShape).isRequired,
  columnsClassName: PropTypes.string.isRequired,
};

export default function StatHighlightsGrid({ primary, supporting = [] }) {
  return (
    <>
      <Cards cards={primary} columnsClassName="sm:grid-cols-2" />

      {supporting.length > 0 && (
        <div className="mt-4">
          <Cards cards={supporting} columnsClassName="sm:grid-cols-3" />
        </div>
      )}
    </>
  );
}

StatHighlightsGrid.propTypes = {
  primary: PropTypes.arrayOf(cardShape).isRequired,
  supporting: PropTypes.arrayOf(cardShape),
};
