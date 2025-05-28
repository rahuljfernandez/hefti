import StarRating from '../../components/ui/molecule/starRating';

export default {
  title: 'COMPONENTS/Molecule/StarRating',
  component: StarRating,
  argTypes: {
    title: { control: 'text' },
    rating: { control: { type: 'range', min: 0, max: 5, step: 0.5 } },
  },
};

const Template = (args) => <StarRating {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Overall Star Rating',
  rating: 3.5,
};
