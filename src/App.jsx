import React from 'react';
import { ownershipProfileData } from './lib/mockData';
import {
  DirectOwnersFlowSection,
  FacilityFlowSection,
  IndirectOwnersFlowSection,
  OperatorFlowSection,
} from './components/ui/organism/ownershipFlowSections';
import OwnershipFlowDiagram from './components/ui/organism/ownershipFlowDiagram';
import { OwnershipBox } from './components/ui/molecule/ownershipFlowBox';

function App() {
  return (
    <div>
      <OwnershipFlowDiagram />
    </div>
  );
}

export default App;
