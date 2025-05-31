import SectionHeader from '../../components/ui/molecule/sectionHeader';

export default {
  title: 'COMPONENTS/Molecule/SectionHeader',
  component: SectionHeader,
};

const Template = (args) => <SectionHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Default Section Header',
  variant: 'default',
};
export const DefaultWithDescription = Template.bind({});
DefaultWithDescription.args = {
  title: 'Default Section Header',
  description: 'With the description of the default section header',
  variant: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Primary Section Header',
  variant: 'primary',
};

export const PrimaryWithDescription = Template.bind({});
PrimaryWithDescription.args = {
  title: 'Primary Section Header',
  variant: 'primary',
  description: 'With the description of the primary section header',
};
