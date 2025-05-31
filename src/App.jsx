import ListContainerDivider from './components/ui/atom/listContainerDivider';
import ListContainerSeperate from './components/ui/atom/listContainerSeperate';
import HeftiNavbar from './components/ui/molecule/heftiNavbar';
import OwnershipAndStakeholders from './components/ui/molecule/ListItems';
import ListItems from './components/ui/molecule/ListItems';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

const ownershipData = [
  {
    id: 1,
    organization: 'Vhs Mo Opco Holdings LLC',
    percentage: '100%',
    type: 'Direct',
    address: '101 Main St, Baltimore, MD',
    contact: 'admin@vhsmo.com',
  },
  {
    id: 2,
    organization: 'Vertical Health Services LLC',
    percentage: null,
    type: 'Indirect',
    address: '501 Health Dr, Tampa, FL',
    contact: 'vhsl@healthco.com',
  },
];

function App() {
  return (
    <div>
      <OwnershipAndStakeholders
        items={ownershipData}
        LayoutSelector={ListContainerDivider}
      />

      <OwnershipAndStakeholders
        items={ownershipData}
        LayoutSelector={ListContainerSeperate}
      />
      <OwnershipAndStakeholders
        items={ownershipData}
        LayoutSelector={ListContainerDivider}
        variant="expandable"
      />

      <OwnershipAndStakeholders
        items={ownershipData}
        LayoutSelector={ListContainerSeperate}
        variant="expandable"
      />
    </div>
  );
}

export default App;
{
  /* <div>
<ListContainerDivider
  items={ownershipData}
  renderItem={(item) => (
    <>
      <Disclosure
        className="flex w-full justify-between text-left"
        as="div"
        defaultOpen={true}
      >
        <span className="text-blue-600 underline">
          {item.organization}
        </span>
        <span className="text-sm">
          {item.percentage || 'No percentage provided'}
        </span>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${
            item.type === 'Direct'
              ? 'bg-cyan-100 text-cyan-700'
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {item.type.toUpperCase()} OWNERSHIP
        </span>
      </Disclosure>
    </>
  )}
/>
</div> */
}
