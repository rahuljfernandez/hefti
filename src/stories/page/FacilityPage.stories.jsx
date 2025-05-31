import FacilityPage from '../../components/ui/organism/facilityPage';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'COMPONENTS/Page/FacilityPage',
  components: FacilityPage,
  decorators: [
    // eslint-disable-next-line no-unused-vars
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Default = () => <FacilityPage />;
