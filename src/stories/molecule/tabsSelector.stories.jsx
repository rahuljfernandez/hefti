import TabsSelector from '../../components/ui/molecule/tabsSelector';

export default {
  title: 'COMPONENTS/Molecule/tabsSelector',
  component: TabsSelector,
};

const tabsData = [
  {
    name: 'Provider Highlights',
    displayTitle: 'Provider Highlights',
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

const Template = (args) => <TabsSelector {...args} />;

export const Base = Template.bind({});
Base.args = {
  tabsData,
  activeTab: tabsData[0],
};
