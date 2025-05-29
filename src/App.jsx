import SectionHeader from './components/ui/atom/sectionHeader';
import TabsWithHeading from './components/ui/molecule/TabsWithHeading';
import FacilityProviderHighlights from './components/ui/organism/facilityProviderHighlights';

const TABS = [
  {
    name: 'Provider Highlights & Ownership',
    displayTitle: 'Provider Highlights',
    href: '#',
  },
  {
    name: 'Deficiencies & Penalties',
    displayTitle: 'Deficiencies from Inspection Reports',
    href: '#',
  },
  {
    name: 'Clinical Quality Measures',
    displayTitle: 'Clinical Quality Measures',
    href: '#',
  },
  {
    name: 'Staffing',
    displayTitle: 'Staffing Quality',
    href: '#',
  },
  {
    name: 'Financial Overview',
    displayTitle: 'Financial Snapshot',
    href: '#',
  },
];

function App() {
  return (
    <div className="p-4">
      <TabsWithHeading tabsData={TABS} />
      <SectionHeader
        title={'Provider Data'}
        description={'This is a bunch of our fancy data dude!'}
        variant="primary"
      />
      <FacilityProviderHighlights />
    </div>
  );
}

export default App;
