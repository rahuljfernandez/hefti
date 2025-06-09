import React from 'react';
import ProfileTemplate from '../../components/ui/template/profileTemplate';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'COMPONENTS/Template/ProfileTemplate',
  component: ProfileTemplate,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = (args) => <ProfileTemplate {...args} />;

export const Default = Template.bind({});
Default.args = {};
