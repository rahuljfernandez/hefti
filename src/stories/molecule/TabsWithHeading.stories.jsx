import TabsWithHeading from '../../components/ui/molecule/TabsWithHeading';

export default {
  title: 'COMPONENTS/Molecule/TabsWithHeading',
  components: TabsWithHeading,
};

const Template = (args) => <TabsWithHeading {...args} />;

const tabsData = [
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

export const Facility = Template.bind({});
Facility.args = {
  tabsData: tabsData,
};
