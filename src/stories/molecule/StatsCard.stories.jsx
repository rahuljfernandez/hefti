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

export const aboveAverageStats = (args) => <StatsCard {...args} />;

aboveAverageStats.args = {
  stats: [
    {
      id: 1,
      name: 'Total Penalties',
      stat: '17',
      rating: 'Above Average',
      nationalAveragePenalties: '3',
    },
    {
      id: 2,
      name: 'Total Fines',
      stat: '753,581',
      rating: 'Above Average',
      nationalAverageFines: '48,371',
    },
  ],
};

export const belowAverageStats = (args) => <StatsCard {...args} />;

belowAverageStats.args = {
  stats: [
    {
      id: 1,
      name: 'Total Penalties',
      stat: '2',
      rating: 'Below Average',
      nationalAveragePenalties: '3',
    },
    {
      id: 2,
      name: 'Total Fines',
      stat: '2,000',
      rating: 'Below Average',
      nationalAverageFines: '48,371',
    },
  ],
};
