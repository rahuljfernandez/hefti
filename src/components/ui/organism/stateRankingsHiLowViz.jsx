import React from 'react';
import { Heading } from '../atom/heading';
import RankingTables from '../molecule/rankingTables';

/**
 * State Rankings section for the home page.
 *
 * Renders four RankingTables (Overall, Financial, Staffing, Health Outcomes)
 * using hardcoded CMS state data. Overall and Health Outcomes span full width;
 * Financial and Staffing sit side-by-side in a two-column grid.
 *
 * When the backend ranking endpoint is ready, data should be lifted here and
 * passed down to each RankingTables via props.
 */
export default function StateRankingsHiLowViz() {
  return (
    <div className="mx-auto max-w-5xl">
      {/*Title/Subtile */}
      <div className="mb-2">
        <Heading
          level={2}
          className="text-heading-lg mb-2 text-center font-semibold"
        >
          State Rankings
        </Heading>
        <p className="text-paragraph-lg text-center">
          Rankings based on cohorts of CMS measures including financial,
          staffing, and health outcomes
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
