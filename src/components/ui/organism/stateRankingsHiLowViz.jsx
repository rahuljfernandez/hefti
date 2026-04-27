import React from 'react';
import { Heading } from '../atom/heading';
import RankingTables from '../molecule/rankingTables';

export default function StateRankingsHiLowViz() {
  return (
    <div className="mx-auto max-w-5xl">
      {/*Title/Subtile */}
      <div>
        <Heading level={3}>State Rankings</Heading>
        <p className="text-paragraph-base">
          Rankings based on CMS nursing home data across all 53 states and
          territories
        </p>
      </div>

      {/*Table Visuals*/}
      <div className="pt-2">
        {/*Overall Rank - full width*/}
        <RankingTables title={'Overall Rank'} metric="overall_rank" />
        {/*Sub-rankings - 2 column grid*/}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RankingTables title={'Financial Rank'} metric="rank_financial" />
          <RankingTables title={'Staffing Rank'} metric="rank_staffing" />
        </div>
        {/*Brought outside the grid to full length */}
        <RankingTables title={'Health Outcomes Rank'} metric="rank_outcomes" />
      </div>
    </div>
  );
}
