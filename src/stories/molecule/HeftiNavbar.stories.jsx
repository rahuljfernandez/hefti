import { MemoryRouter } from 'react-router-dom';
import HeftiNavbar from '../../components/ui/molecule/heftiNavbar';

export default {
  title: 'COMPONENTS/Molecule/Navbar',
  components: HeftiNavbar,
  decorators: [
    // eslint-disable-next-line no-unused-vars
    (Story) => {
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const Default = () => <HeftiNavbar />;
