import React from 'react';
import { Heading } from '../../atom/heading';
import ListContainer, {
  ListContainerSeparate,
} from '../../organism/ListContainer';
import { MetricCardLong } from '../listContainerContent';
/**
 *  This component displays the Clinical Quality Measures data for an individual facility. Will be apart of the dynamic tabs scheme.
 */

export default function ClinicalQuality({ ownershipLinks, facility }) {
  //I'm assuming at this point facility/ownershiptLinks will hold the needed data once backend is updated.
  // Temporary test data until backend connects
  const mockStats = [
    {
      id: 1,
      title: 'Falls with major injury',
      subtitle: 'Lower percentages are better',
      value: '2.6%',
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '2.1%',
      nationalAverage: '1.2%',
    },
    {
      id: 2,
      title: 'Hospitalizations per 1,000 long-stay resident days',
      subtitle: 'Lower numbers are better',
      value: '1.5',
      label: 'Lower Than State Average',
      labelColor: 'green',
      state: 'Missouri',
      stateAvg: '1.8',
      nationalAverage: '1.7',
    },
    {
      id: 3,
      title: 'Residents received antipsychotic medication',
      subtitle: 'Lower percentages are better',
      value: '16%',
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '12%',
      nationalAverage: '8%',
    },
    {
      id: 4,
      title: 'Residents with pressure ulcers',
      subtitle: 'Lower percentages are better',
      value: '5.3%',
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '4.3%',
      nationalAverage: '4.3%',
    },
    {
      id: 5,
      title: 'Hospitalizations per 1,000 long-stay resident days',
      subtitle: 'Lower numbers are better',
      value: '1.5',
      label: 'Above State Average',
      labelColor: 'red',
      state: 'Missouri',
      stateAvg: '1.2',
      nationalAverage: '0.8',
    },
  ];

  return (
    <section>
      {/**Long Stay Stats */}
      <div>
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Long Stay
        </Heading>
        <ListContainer
          items={mockStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
      {/**Long Stay Stats */}
      <div className="pb-8">
        <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
          Short Stay
        </Heading>
        <ListContainer
          items={mockStats}
          LayoutSelector={ListContainerSeparate}
          ListContent={MetricCardLong}
        />
      </div>
    </section>
  );
}
