import * as React from 'react';
import Breadcrumb from '../../components/ui/molecule/breadcrumb';

export default {
  title: 'COMPONENTS/Molecule/Breadcrumb',
  components: Breadcrumb,
};

const Template = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
  pages: [
    { name: 'Previous Page', href: '#', current: false },
    { name: 'Current Page', href: '#', current: true },
  ],
};
