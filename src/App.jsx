import React from 'react';

import ListContainer, {
  ListContainerDivider,
  ListContainerSeparate,
} from './components/ui/organism/listContainer';
import {
  Deficiencies,
  OwnershipAndStakeholders,
  Penalties,
  RelatedFacilities,
} from './components/ui/molecule/listContainerContent';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { relatedFacilitiesData } from './lib/mockData';

function App() {
  return (
    <div className="bg-background-primary p-8">
      <ListContainer
        items={relatedFacilitiesData}
        LayoutSelector={ListContainerDivider}
        ListContent={RelatedFacilities}
        variant="expandable"
      />

      <ListContainer
        items={relatedFacilitiesData}
        LayoutSelector={ListContainerSeparate}
        ListContent={RelatedFacilities}
      />
    </div>
  );
}

export default App;
