import FacilityTabDescription from '../molecule/ProfileDescription';
import StatsCard from '../molecule/statsCard';
import CMSRating from '../molecule/CMSRating';
import LayoutCard from '../atom/layout-card';
/**
 * Organism component that will be used to build FaciltyPage-this is the top block(Provider Highlights)
 *
 */

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

//will need to make star props dynamic
export default function FacilityProviderHighlights() {
  return (
    <LayoutCard>
      <div className="border-b border-gray-200 pb-5">
        <FacilityTabDescription />
      </div>
      <div className="border-b border-gray-200 py-5">
        <CMSRating
          stars={[
            { title: 'Overall Star Rating', rating: 4 },
            { title: 'Average Collective Owner Ranking', rating: 5 },
          ]}
        />
      </div>
      <div className="">
        <StatsCard variant="panel" stats={otherStats} />
      </div>
    </LayoutCard>
  );
}
