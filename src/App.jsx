import React from 'react';
import { ownershipProfileData } from './lib/mockData';
import { IndirectOwnersFlowSection } from './components/ui/organism/ownershipFlowSections';

function App() {
  return (
    <IndirectOwnersFlowSection items={ownershipProfileData.indirectOwners} />
  );
}

export default App;
