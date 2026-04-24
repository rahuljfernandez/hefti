import React from 'react';
import {
  CorporateFlowSection,
  DirectOwnersFlowSection,
  FacilityFlowSection,
  IndirectOwnersFlowSection,
  OperatorFlowSection,
} from '../organism/ownershipFlowSections';
import LayoutCard from '../atom/layout-card';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import { toTitleCase } from '../../../lib/toTitleCase';

/**
 * Ownership structure diagram for a facility profile.
 *
 * Responsibilities:
 * - Renders the visual ownership flow sections for the current facility
 * - Groups owners by role so the hierarchy is visible at a glance
 * - Provides a text-equivalent summary for non-visual users
 */

export default function OwnershipFlowDiagram({ items, facility }) {
  const hasOperator = items.some(
    (owner) => owner.cms_ownership_role === 'OPERATIONAL/MANAGERIAL CONTROL',
  );
  const indirectOwners = items.filter(
    (owner) =>
      owner.cms_ownership_role === '5% OR GREATER INDIRECT OWNERSHIP INTEREST',
  );
  const directOwners = items.filter(
    (owner) =>
      owner.cms_ownership_role === '5% OR GREATER DIRECT OWNERSHIP INTEREST',
  );
  const corporateOfficers = items.filter(
    (owner) => owner.cms_ownership_role === 'CORPORATE OFFICER',
  );
  const corporateDirectors = items.filter(
    (owner) => owner.cms_ownership_role === 'CORPORATE DIRECTOR',
  );
  const operators = items.filter(
    (owner) => owner.cms_ownership_role === 'OPERATIONAL/MANAGERIAL CONTROL',
  );

  return (
    <>
      <LayoutCard aria-hidden="true">
        <IndirectOwnersFlowSection items={items} />
        <DirectOwnersFlowSection items={items} facility={facility} />
        <CorporateFlowSection items={items} />
        <FacilityFlowSection
          items={items}
          facility={facility}
          hasOperator={hasOperator}
        />
        <OperatorFlowSection items={items} />
      </LayoutCard>

      <section className="sr-only" aria-labelledby="ownership-diagram-summary">
        <Heading id="ownership-diagram-summary" level={4}>
          Ownership structure summary
        </Heading>

        <p>{toTitleCase(facility.provider_name)} ownership structure.</p>

        <div>
          <p>Indirect owners</p>
          {indirectOwners.length > 0 ? (
            <ul>
              {indirectOwners.map((owner) => (
                <li key={`${owner.cms_ownership_role}-${owner.ownership_entity.cms_ownership_name}`}>
                  {toTitleCase(owner.ownership_entity.cms_ownership_name)}
                  {owner.cms_ownership_percentage != null
                    ? `, ${owner.cms_ownership_percentage}% ownership`
                    : ', ownership percentage not provided'}
                </li>
              ))}
            </ul>
          ) : (
            <p>None listed.</p>
          )}
        </div>

        <div>
          <p>Direct owners</p>
          {directOwners.length > 0 || facility.pe_name ? (
            <ul>
              {directOwners.map((owner) => (
                <li key={`${owner.cms_ownership_role}-${owner.ownership_entity.cms_ownership_name}`}>
                  {toTitleCase(owner.ownership_entity.cms_ownership_name)}
                  {owner.cms_ownership_percentage != null
                    ? `, ${owner.cms_ownership_percentage}% ownership`
                    : ', ownership percentage not provided'}
                </li>
              ))}
              {facility.pe_name && (
                <li>{toTitleCase(facility.pe_name)}, private equity affiliation</li>
              )}
            </ul>
          ) : (
            <p>None listed.</p>
          )}
        </div>

        <div>
          <p>Corporate management</p>
          {corporateOfficers.length > 0 || corporateDirectors.length > 0 ? (
            <ul>
              {corporateOfficers.map((owner) => (
                <li key={`officer-${owner.ownership_entity.cms_ownership_name}`}>
                  Corporate officer: {toTitleCase(owner.ownership_entity.cms_ownership_name)}
                </li>
              ))}
              {corporateDirectors.map((owner) => (
                <li key={`director-${owner.ownership_entity.cms_ownership_name}`}>
                  Corporate director: {toTitleCase(owner.ownership_entity.cms_ownership_name)}
                </li>
              ))}
            </ul>
          ) : (
            <p>None listed.</p>
          )}
        </div>

        <div>
          <p>Facility details</p>
          <ul>
            <li>Facility name: {toTitleCase(facility.provider_name)}</li>
            {facility.reit_name && <li>REIT: {toTitleCase(facility.reit_name)}</li>}
          </ul>
        </div>

        <div>
          <p>Operators</p>
          {operators.length > 0 ? (
            <ul>
              {operators.map((owner) => (
                <li key={`operator-${owner.ownership_entity.cms_ownership_name}`}>
                  {toTitleCase(owner.ownership_entity.cms_ownership_name)}
                </li>
              ))}
            </ul>
          ) : (
            <p>None listed.</p>
          )}
        </div>
      </section>
    </>
  );
}

OwnershipFlowDiagram.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      cms_ownership_role: PropTypes.string,
      cms_ownership_percentage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      ownership_entity: PropTypes.shape({
        cms_ownership_name: PropTypes.string,
      }),
    }),
  ).isRequired,
  facility: PropTypes.shape({
    provider_name: PropTypes.string,
    pe_name: PropTypes.string,
    reit_name: PropTypes.string,
  }).isRequired,
};
