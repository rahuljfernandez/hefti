import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import {
  Deficiencies,
  OwnershipAndStakeholders,
  Penalties,
  RelatedFacilities,
  BrowseNursingHomes,
  BrowseOwners,
} from '../../components/ui/molecule/listContainerContent';
import ListContainer, {
  ListContainerDivider,
  ListContainerSeparate,
} from '../../components/ui/organism/ListContainer';
import {
  deficiencyReports,
  ownershipData,
  penaltiesData,
  relatedFacilitiesData,
  nursingHomesMock,
  ownersMock,
} from '../../lib/mockData';

export default {
  title: 'COMPONENTS/Organism/ListContainer',
  components: ListContainer,
  argTypes: {
    layoutType: {
      control: {
        type: 'radio',
      },
      options: ['divider', 'separate'],
      description: 'Choose list layout variant',
      defaultValue: 'divider',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const layoutMap = {
  divider: ListContainerDivider,
  separate: ListContainerSeparate,
};

const Template = ({ layoutType = 'divider', ...args }) => {
  const LayoutSelector = layoutMap[layoutType];
  return <ListContainer {...args} LayoutSelector={LayoutSelector} />;
};

Template.propTypes = {
  layoutType: PropTypes.oneOf(['divider', 'separate']),
};

export const OwnershipStakeholders = Template.bind({});
OwnershipStakeholders.args = {
  items: ownershipData,
  layoutType: 'divider',
  ListContent: OwnershipAndStakeholders,
};

export const Deficiencies_ = Template.bind({});
Deficiencies_.args = {
  items: deficiencyReports,
  layoutType: 'divider',
  ListContent: Deficiencies,
};

export const Penalties_ = Template.bind({});
Penalties_.args = {
  items: penaltiesData,
  layoutType: 'divider',
  ListContent: Penalties,
};

export const RelatedFacilities_ = Template.bind({});
RelatedFacilities_.args = {
  items: relatedFacilitiesData,
  layoutType: 'divider',
  ListContent: RelatedFacilities,
};

export const BrowseFacilities_ = Template.bind({});
BrowseFacilities_.args = {
  items: nursingHomesMock,
  layoutType: 'separate',
  ListContent: BrowseNursingHomes,
};

export const BrowseOwners_ = Template.bind({});
BrowseOwners_.args = {
  items: ownersMock,
  layoutType: 'separate',
  ListContent: BrowseOwners,
};
