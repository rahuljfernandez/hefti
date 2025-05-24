import StatsCard from '../components/ui/statsCard';

export default {
  title: 'COMPONENTS/StatsCard',
  component: StatsCard,
  argTypes: {
    stats: {
      control: { type: 'array' },
    },
  },
};

export const Stats = (args) => <StatsCard {...args} />;

Stats.args = {
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
