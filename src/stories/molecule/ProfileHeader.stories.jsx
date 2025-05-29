import ProfileHeader from '../../components/ui/molecule/profileHeader';

export default {
  title: 'COMPONENTS/Molecule/ProfileHeader',
  components: ProfileHeader,
};

const Template = (args) => <ProfileHeader {...args} />;

export const Facility = Template.bind({});
Facility.args = {
  title: 'Aspen Point Health and Rehabilitation',
  badges: [
    { title: 'FOR PROFIT', color: 'cyan' },
    { title: 'INDIVIDUAL', color: 'orange' },
  ],
};

export const Owner = Template.bind({});
Owner.args = {
  title: 'Abby GL LLC',
  badges: [{ title: 'ORGANIZATION', color: 'orange' }],
};
