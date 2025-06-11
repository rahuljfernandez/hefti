import React from 'react';

import { OwnershipBox } from '../../components/ui/molecule/ownershipFlowBox';
import { label } from 'framer-motion/client';

export default {
  title: 'COMPONENTS/Molecule/OwnershipFlowBox',
  component: OwnershipBox,
};

const Template = (args) => <OwnershipBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label1: 'FACILITY OPERATOR',
  value1: 'Mullins Street Consulting LLC',
};

export const withSecondLine = Template.bind({});
withSecondLine.args = {
  label1: 'PROPERTY OWNER',
  value1: 'Omega Healthcare Investors, Inc.',
  label2: 'OWNER TYPE',
  value2: 'REIT',
};

export const OrangeVariant = Template.bind({});
OrangeVariant.args = {
  label1: 'FACILITY NAME',
  value1: 'Aspen Point Health And Rehabilitation',
  label2: 'MANAGING EMPLOYEE',
  value2: 'Keesha Robinson',
  variant: 'orange',
};

export const LongText = Template.bind({});
LongText.args = {
  label1: 'VERY LONG LABEL THAT SHOULD WRAP NICELY',
  value1:
    'This is a very long value that might overflow or wrap across multiple lines depending on layout',
  label2: 'SECONDARY LABEL',
  value2:
    'Another very long text string here to test responsiveness and layout constraints',
};
