import React from 'react';
import {
  Deficiencies,
  OwnershipAndStakeholders,
  Penalties,
  RelatedFacilities,
} from '../../components/ui/molecule/listContainerContent';
import ListContainer, {
  ListContainerDivider,
  ListContainerSeparate,
} from '../../components/ui/organism/listContainer';
import {
  deficiencyReports,
  ownershipData,
  penaltiesData,
  relatedFacilitiesData,
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
};

const layoutMap = {
  divider: ListContainerDivider,
  separate: ListContainerSeparate,
};

import PropTypes from 'prop-types';

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
