import React from 'react';
import ListContainer, {
  ListContainerSeparate,
} from '../../organism/ListContainer';
import { MetricCardLong } from '../listContainerContent';
import { Heading } from '../../atom/heading';

export default function FinancialOverviewTab({ items }) {
  const mockStats = [
    {
      id: 1,
      title: 'Operating Margin',
      subtitle:
        'The percentage of revenue left after operating costs.  Higher values suggest better financial health',
      value: `${items.operating_margin.toFixed(1)}%`,
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '2.1%',
      nationalAverage: '1.2%',
    },
    {
      id: 2,
      title: 'Total Margin',
      subtitle:
        'Overall profitability after all expenses.  Higher values indicate better performance',
      value: `${items.total_margin.toFixed(1)}%`,
      label: 'Above State Average',
      labelColor: 'green',
      state: 'Missouri',
      stateAvg: '1.8',
      nationalAverage: '1.7',
    },
    {
      id: 3,
      title: 'Direct Clinical Care Expenses Relative to Total Expenses',
      subtitle:
        'Shows how much of total spending goes to direct resident care. Lower percentages may mean underinvestment in care.',
      value: '?%',
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '12%',
      nationalAverage: '8%',
    },
  ];

  const mockStats2 = [
    {
      id: 1,
      title: 'Related Party Transactions',
      subtitle:
        'Percentage of expenses paid to affiliated companies.  High numbers can raise concerns about transparency.',
      value: `${items.related_party_to_total_op_expenses.toFixed(1)}%`,
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '2.1%',
      nationalAverage: '1.2%',
    },
  ];

  const mockStats3 = [
    {
      id: 1,
      title: 'Current Ratio',
      subtitle:
        'Measures ability to cover short-term debts.  Higher values suggest stronger short term financial stability',
      value: `?%`,
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '2.1%',
      nationalAverage: '1.2%',
    },
    {
      id: 2,
      title: 'Long Term Debt to Capital Expenses',
      subtitle:
        'Shows reliance on debt for capital imporovments.  Lower values indicate more sustainable investment strategies.',
      value: `?%`,
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '2.1%',
      nationalAverage: '1.2%',
    },
  ];

  return (
    <section>
      {/*Staffing Header */}
      <div className="my-8">
        <div className="">
          <div className={'text-heading-md'}>Financial Overview</div>
        </div>
        <div className="my-4">
          <p className="text-paragraph-lg mb-4">
            This page provides a snapshot of a facility's financial health,
            including profitabilty, spending patterns, and liquidity. Reviewing
            those metrics can help you assess how a nursing home allocates its
            resources, whether it's financially stable, and how much is invested
            in resident care versus affiliated businesses. User these indicators
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
          items={mockStats}
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
          items={mockStats2}
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
          items={mockStats3}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
    </section>
  );
}
