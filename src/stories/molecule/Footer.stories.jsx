import Footer from '../../components/ui/molecule/footer';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'COMPONENTS/Molecule/Footer',
  components: Footer,
  decorators: [
    // eslint-disable-next-line no-unused-vars
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = () => <Footer />;
