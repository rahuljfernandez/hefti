import React from 'react';
import { ownershipProfileData } from '../../../lib/mockData';
import {
  DirectOwnersFlowSection,
  FacilityFlowSection,
  IndirectOwnersFlowSection,
  OperatorFlowSection,
} from '../organism/ownershipFlowSections';
import LayoutCard from '../atom/layout-card';

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

export default function OwnershipFlowDiagram() {
  return (
    <LayoutCard>
      <IndirectOwnersFlowSection items={ownershipProfileData.indirectOwners} />
      <DirectOwnersFlowSection items={ownershipProfileData.directOwners} />
      <FacilityFlowSection items={ownershipProfileData.facility} />
      <OperatorFlowSection items={ownershipProfileData.operator} />
    </LayoutCard>
  );
}
