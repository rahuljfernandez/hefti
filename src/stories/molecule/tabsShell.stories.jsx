import TabsShell from '../../components/ui/molecule/tabsShell';

export default {
  title: 'COMPONENTS/Molecule/tabsShell',
  component: TabsShell,
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

const Template = (args) => (
  <TabsShell {...args}>
    {(activeTab) => (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="text-heading-sm mb-2">{activeTab.name}</div>
        <p className="text-paragraph-base text-content-secondary">
          Example content rendered by the parent page for the selected tab.
        </p>
      </div>
    )}
  </TabsShell>
);

export const Base = Template.bind({});
Base.args = {
  tabsData,
  defaultTabName: 'Provider Highlights',
};
