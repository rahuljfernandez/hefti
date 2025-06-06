import * as React from 'react';
import CMSRating from '../../components/ui/molecule/CMSRating';

export default {
  title: 'COMPONENTS/Molecule/CMSRating',
  components: CMSRating,
};

const Template = (args) => <CMSRating {...args} />;

export const Default = Template.bind({});
Default.args = {
  stars: [
    { title: 'Overall Star Rating', rating: 4 },
    { title: 'Average Collective Owner Ranking', rating: 5 },
  ],
};
