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

export const cardVariant = (args) => <StatsCard {...args} />;

cardVariant.args = {
  variant: 'card',
  stats: [
    {
      id: 1,
      key: 'Total Penalties',
      stat: '17',
      rating: 'Above Average',
      nationalAveragePenalties: '3',
    },
    {
      id: 2,
      key: 'Total Fines',
      stat: '753,581',
      rating: 'Below Average',
      nationalAverageFines: '48,371',
    },
  ],
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
