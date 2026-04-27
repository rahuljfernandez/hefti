import React from 'react';
import { Heading } from '../atom/heading';
import RankingTables from '../molecule/rankingTables';

export default function StateRankingsHiLowViz() {
  return (
    <div className="mx-auto max-w-5xl">
      {/*Title/Subtile */}
      <div>
        <Heading level={2}>State Rankings</Heading>
        <p className="text-paragraph-lg">
          Rankings based on CMS nursing home data across all 53 states and
          territories
        </p>
      </div>

      {/*Table Visuals*/}
      {/*Overall Rank*/}
      <RankingTables title={'Overall Rank'} metric="overall_rank" />
      {/*Financial Rank*/}
      <RankingTables title={'Financial Rank'} metric="rank_financial" />
      {/*Staffing Rank*/}
      <RankingTables title={'Staffing Rank'} metric="rank_staffing" />
      {/*Health Outcome Rank*/}
      <RankingTables title={'Health Outcomes Rank'} metric="rank_outcomes" />
    </div>
  );
}
