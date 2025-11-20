import React from 'react';
import { Heading } from '../atom/heading';
import { ownershipChangeData } from '../../../lib/mockData';

import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { ParentSize } from '@visx/responsive';

/**
 * This file contains two components.  First is MonthlyOwnershipChangeChart which serves as the container for the section.
 * The Chart component contains all the details within the barchart. The barchart is build with the visix component library https://visx.airbnb.tech/bars
 *
 */

export default function MonthlyOwnershipChangeChart() {
  /**
   * Contains seciton title. ParentSize is a Visix component that allows for responsiveness and it is wrapping the Chart component and passing it a dynamic width to Chart.
   */
  return (
    <div>
      <Heading level={3} className={'mb-4'}>
        Monthly SNF Ownership Change Volume (2024-2025)
      </Heading>

      <ParentSize>
        {({ width }) => <Chart width={width} height={600} />}
      </ParentSize>
    </div>
  );
}

function Chart({ width, height }) {
  const margin = { top: 20, right: 40, bottom: 20, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  //Responsive settings for SVG
  const isMobile = width < 500;
  //Font size
  const responsiveFontSize = isMobile ? 12 : 16;
  //X axis positioning of month label
  const monthXLabel = isMobile ? 62 : 50;
  //X axis positioning of facilities ownership change label
  const textXLabel = isMobile ? 10 : 50;
  const lineXlabel2 = isMobile ? width - 35 : 500;
  //X axis positioning of specific month column list items
  const monthXListItems = isMobile ? -10 : 20;
  //X axis positioning of bars
  const barXListItems = isMobile ? 10 : 50;

  // Scales
  const yScale = scaleBand({
    domain: ownershipChangeData.map((d) => d.month),
    padding: 0.25,
    range: [0, innerHeight],
  });

  const xScale = scaleLinear({
    domain: [0, Math.max(...ownershipChangeData.map((d) => d.count))],
    range: [0, innerWidth],
    nice: true,
  });

  return (
    <div className="bg-core-white border-border-primary overflow-hidden rounded-xl border p-4 shadow-sm sm:p-6">
      <svg width={width} height={height}>
        {/* Header and labels above chart */}
        <Text
          x={margin.left - monthXLabel}
          y={margin.top}
          textAnchor="end"
          fontSize={responsiveFontSize}
          fontWeight={500}
          fill="#000"
        >
          Month
        </Text>

        <Text
          x={margin.left + textXLabel}
          y={margin.top}
          textAnchor="start"
          fontSize={responsiveFontSize}
          fontWeight={500}
          fill="000"
        >
          Facilities with Ownership Changes
        </Text>

        {/* Horizontal line */}
        <line
          x1={0}
          x2={lineXlabel2}
          y1={margin.top + 20}
          y2={margin.top + 20}
          stroke="#000"
          strokeWidth={3}
        />

        <Group top={margin.top + 30} left={margin.left}>
          {ownershipChangeData.map((d) => {
            const barWidth = xScale(d.count);
            const barY = yScale(d.month);
            const barHeight = yScale.bandwidth();

            return (
              <Group key={d.month}>
                {/* Bar */}
                <Bar
                  x={barXListItems}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="#1f2937" // Tailwind gray-800
                  rx={4}
                />

                {/* Value Text */}
                <Text
                  x={monthXListItems}
                  y={barY + barHeight / 2}
                  verticalAnchor="middle"
                  textAnchor="end"
                  fontSize={responsiveFontSize}
                  fontWeight={500}
                  fill="#000"
                >
                  {d.count}
                </Text>

                {/* Month label (left side) */}
                <Text
                  x={-100}
                  y={barY + barHeight / 2}
                  verticalAnchor="middle"
                  textAnchor="start"
                  fontSize={responsiveFontSize}
                  fontWeight={500}
                  fill="#000"
                >
                  {d.month}
                </Text>
              </Group>
            );
          })}
        </Group>
      </svg>
    </div>
  );
}
