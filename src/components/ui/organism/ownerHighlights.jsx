import React from 'react';
import CMSRating from '../molecule/CMSRating';
import StatsCard from '../molecule/statsCard';
import LayoutCard from '../atom/layout-card';

/**
 * Organism component that will be used to build OwnerPage-this is the top block(Owner Highlights)
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
//will need to make rating prop dynamic once we have access to data
export default function OwnerHighlights() {
  return (
    <LayoutCard>
      <div className="border-b border-gray-200 py-5">
        <CMSRating
          stars={[
            { title: 'Average Rating Across All Facilities', rating: 3.5 },
          ]}
        />
      </div>
      <div className="">
        <StatsCard variant="panel" stats={otherStats} />
      </div>
    </LayoutCard>
  );
}
