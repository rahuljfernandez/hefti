import FacilityTabDescription from '../molecule/facilityTabDescription';
import FacilityCMSRating from '../molecule/facilityCMSRating';
import StatsCard from '../molecule/statsCard';

const otherStats = [
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
];

export default function FacilityProviderHighlights() {
  return (
    <div>
      <div className="border-b border-gray-200 py-5">
        <FacilityTabDescription />
      </div>
      <div className="border-b border-gray-200 py-5">
        <FacilityCMSRating />
      </div>
      <div className="">
        <StatsCard variant="panel" stats={otherStats} />
      </div>
    </div>
  );
}
