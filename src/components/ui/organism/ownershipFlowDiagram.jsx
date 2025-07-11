import React from 'react';
import { ownershipProfileData } from '../../../lib/mockData';
import {
  CorporateFlowSection,
  DirectOwnersFlowSection,
  FacilityFlowSection,
  IndirectOwnersFlowSection,
  OperatorFlowSection,
} from '../organism/ownershipFlowSections';
import LayoutCard from '../atom/layout-card';
import PropTypes from 'prop-types';

/**
 * This component visually represents the ownership structure of a facility
 * -Indirect Oners
 * -Direct Owners
 * -Facility Info
 * -Operator Info
 *
 * Each section is respresented by its own organism level component found in ownershipFlowSections.jsx
 *
 * Data is currently hardcoded using "ownershipProfileData" found in lib
 * TODO: I think conditional rendering if no section data is found will need to be handled here.
 */

export default function OwnershipFlowDiagram({ items, facility }) {
  const hasOperator = items.some(
    (owner) => owner.cms_ownership_role === 'OPERATIONAL/MANAGERIAL CONTROL',
  );
  return (
    <LayoutCard>
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
  );
}
