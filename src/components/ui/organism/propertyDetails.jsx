import React from 'react';
import PropTypes from 'prop-types';
import DisclosureCard from '../molecule/disclosureCard';
import DetailTableSplit from '../molecule/detailTable';
import { Heading } from '../atom/heading';
import { buildPropertyDetailSections } from '../../../lib/propertyMetrics';

/**
 * Property Details — the third section of the Property Details tab.
 *
 * Three subsections (Financial / Building / Land), each a DisclosureCard
 * holding a two-column ruled table. All start collapsed — the tables carry a
 * lot of low-salience fields, so the page opens as three scannable headers
 * rather than a wall of rows.
 *
 * `source` is optional; the builders fall back to placeholder data until the
 * property API lands. See lib/propertyMetrics.js.
 */
export default function PropertyDetails({ source }) {
  const sections = buildPropertyDetailSections(source);

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        Property Details
      </Heading>

      <div className="flex flex-col gap-4">
        {sections.map(({ title, left, right }) => (
          <DisclosureCard key={title} title={title}>
            <DetailTableSplit left={left} right={right} />
          </DisclosureCard>
        ))}
      </div>
    </section>
  );
}

PropertyDetails.propTypes = {
  source: PropTypes.object,
};
