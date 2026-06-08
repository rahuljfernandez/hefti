import React from 'react';
import StatsCard from '../../components/ui/molecule/statsCard';

export default {
  title: 'COMPONENTS/Molecule/StatsCard',
  component: StatsCard,
  argTypes: {
    stats: {
      control: { type: 'array' },
    },
  },
};

// The card variant renders a single item — it is used as ListContent inside
// ListContainer, which supplies one item per grid cell.
export const cardVariant = (args) => <StatsCard {...args} />;

cardVariant.args = {
  variant: 'card',
  item: {
    key: 'Total Penalties',
    stat: '17',
    rating: 'Above Average',
    description: 'Total number of penalties issued against this facility',
    detail1: 'Hawaii average: 0.7',
    detail2: 'National average: 1.1',
  },
};

export const panelVariant = (args) => <StatsCard {...args} />;

panelVariant.args = {
  variant: 'panel',
  stats: [
    {
      id: 1,
      key: 'Total Deficiencies',
      stat: '17',
      rating: 'Above Average',
      nationalAveragePenalties: '3',
    },
    {
      id: 2,
      key: 'Staffing Score',
      stat: '1',
      rating: 'Below Average',
      nationalAverageFines: '3.2',
    },
    {
      id: 3,
      key: 'Health Inspection',
      stat: '1',
      rating: 'Below Average',
      nationalAverageFines: '2.3',
    },
  ],
};
