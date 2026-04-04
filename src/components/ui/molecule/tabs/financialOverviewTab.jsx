import React from 'react';
import PropTypes from 'prop-types';
import ListContainer, {
  ListContainerSeparate,
} from '../../organism/ListContainer';
import { MetricCardLong } from '../listContainerContent';
import { Heading } from '../../atom/heading';
import {
  buildFacilityProfitStats,
  buildFacilityRevenueStats,
  buildFacilityExpensesStats,
  buildFacilityLiquidityStats,
  buildOwnerProfitStats,
  buildOwnerRevenueStats,
  buildOwnerExpensesStats,
  buildOwnerLiquidityStats,
} from '../../../../lib/financialMetrics';

export default function FinancialOverviewTab({ items, national, status }) {
  const profitStats =
    status === 'facility'
      ? buildFacilityProfitStats(items, national)
      : buildOwnerProfitStats(items);

  const revenueStats =
    status === 'facility'
      ? buildFacilityRevenueStats(items, national)
      : buildOwnerRevenueStats(items);

  const expensesStats =
    status === 'facility'
      ? buildFacilityExpensesStats(items, national)
      : buildOwnerExpensesStats(items);

  const liquidityStats =
    status === 'facility'
      ? buildFacilityLiquidityStats(items, national)
      : buildOwnerLiquidityStats(items);

  return (
    <section>
      {/*Financial Header */}
      <div className="my-8">
        <div className="">
          <div className={'text-heading-md'}>Financial Overview</div>
        </div>
        <div className="my-4">
          <p className="text-paragraph-lg mb-4">
            This page provides a snapshot of a facility's financial health,
            including profitability, spending patterns, and liquidity. Reviewing
            those metrics can help you assess how a nursing home allocates its
            resources, whether it's financially stable, and how much is invested
            in resident care versus affiliated businesses. Use these indicators
            to identify red flags or signs of strong financial management.
          </p>
          <p className="text-paragraph-lg font-bold">
            HEFTI tracks data going back to 2010
          </p>
        </div>
      </div>

      {/**Profits*/}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Profit
        </Heading>
        <ListContainer
          items={profitStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>

      {/**Revenue */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Revenue
        </Heading>
        <ListContainer
          items={revenueStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>

      {/**Expenses */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Expenses
        </Heading>
        <ListContainer
          items={expensesStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>

      {/**Liquidity */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Liquidity
        </Heading>
        <ListContainer
          items={liquidityStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
    </section>
  );
}

FinancialOverviewTab.propTypes = {
  items: PropTypes.object,
  national: PropTypes.object,
  status: PropTypes.string,
};
