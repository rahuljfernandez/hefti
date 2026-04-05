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

/**
 * Financial overview tab content.
 *
 * Responsibilities:
 * - Builds profit, revenue, expense, and liquidity metric groups
 * - Switches between facility and owner metric builders based on status
 * - Passes national benchmark data when facility metrics need comparison values
 * - Renders each financial section using the shared long-form metric card layout
 */
export default function FinancialOverviewTab({
  items,
  nationalBenchmarks,
  status,
}) {
  // Build stat arrays from lib config; maps data keys to display-ready objects.
  const profitStats =
    status === 'facility'
      ? buildFacilityProfitStats(items, nationalBenchmarks)
      : buildOwnerProfitStats(items);

  const revenueStats =
    status === 'facility'
      ? buildFacilityRevenueStats(items, nationalBenchmarks)
      : buildOwnerRevenueStats(items);

  const expensesStats =
    status === 'facility'
      ? buildFacilityExpensesStats(items, nationalBenchmarks)
      : buildOwnerExpensesStats(items);

  const liquidityStats =
    status === 'facility'
      ? buildFacilityLiquidityStats(items, nationalBenchmarks)
      : buildOwnerLiquidityStats(items);

  return (
    <section>
      {/* Intro copy frames how to interpret the financial metric groups below. */}
      <div className="my-8">
        <div className="">
          <h2 className="text-heading-md">Financial Overview</h2>
        </div>
        <div className="my-4">
          <p className="text-paragraph-lg mb-4">
            This page provides a snapshot of a facility&apos;s financial health,
            including profitability, spending patterns, and liquidity. Reviewing
            those metrics can help you assess how a nursing home allocates its
            resources, whether it&apos;s financially stable, and how much is invested
            in resident care versus affiliated businesses. Use these indicators
            to identify red flags or signs of strong financial management.
          </p>
          <p className="text-paragraph-lg font-bold">
            HEFTI tracks data going back to 2010
          </p>
        </div>
      </div>

      {/* Profit metrics summarize overall operating performance and margin outcomes. */}
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

      {/* Revenue metrics focus on income generated from patient services. */}
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

      {/* Expense metrics show where spending is concentrated and how related-party costs compare. */}
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

      {/* Liquidity metrics indicate the provider's ability to cover obligations and finance operations. */}
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
  nationalBenchmarks: PropTypes.object,
  status: PropTypes.string,
};
