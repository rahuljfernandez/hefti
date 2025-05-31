import Tabs from '../../components/ui/molecule/Tabs';

export default {
  title: 'COMPONENTS/Molecule/Tabs',
  components: Tabs,
};

const Template = (args) => <Tabs {...args} />;

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
