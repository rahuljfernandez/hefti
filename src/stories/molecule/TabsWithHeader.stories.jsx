import TabsWithHeader from '../../components/ui/molecule/tabsWithHeader';

export default {
  title: 'COMPONENTS/Molecule/TabsWithHeader',
  components: TabsWithHeader,
};

const Template = (args) => <TabsWithHeader {...args} />;

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

export const Base = Template.bind({});
Base.args = {
  tabsData: tabsData,
};
