import React from 'react';
import OwnershipFlowCard from '../../components/ui/molecule/ownershipFlowCard';
import { OwnershipBox } from '../../components/ui/molecule/ownershipFlowBox';

export default {
  title: 'COMPONENTS/Molecule/OwnershipFlowCard',
  component: OwnershipFlowCard,
  args: {
    title: 'DIRECT OWNER',
    color: 'bg-blue-50',
  },
  argTypes: {
    title: { control: 'text' },
    color: {
      control: 'select',
      options: [
        'bg-blue-50',
        'bg-purple-50',
        'bg-orange-50',
        'bg-yellow-50',
        'bg-white',
      ],
    },
  },
};

const Template = (args) => (
  <OwnershipFlowCard {...args}>
    <div className="flex justify-center gap-4">
      <OwnershipBox
        label1="INDIRECT OWNER"
        value1="ABC CORP"
        label2="OWNERSHIP PERCENTAGE"
        value2="60%"
      />
      <OwnershipBox
        label1="INDIRECT OWNER"
        value1="DEF INC HOLDINGS PARTNERS"
        label2="OWNERSHIP PERCENTAGE"
        value2="40%"
      />
    </div>
  </OwnershipFlowCard>
);

export const Default = Template.bind({});
