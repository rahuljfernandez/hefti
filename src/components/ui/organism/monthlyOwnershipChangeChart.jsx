import React, { useEffect, useState, useId } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '../atom/heading';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { ParentSize } from '@visx/responsive';
import { ChartSkeleton } from '../atom/skeletons';
import { ErrorBanner } from '../atom/errorBanner';

/**
 * Monthly ownership-change chart section.
 *
 * Responsibilities:
 * - Fetches monthly ownership-change volume data
 * - Renders a responsive horizontal bar chart with accessible SVG labeling
 * - Provides a text-equivalent table for non-visual access
 * - Displays loading and error states for the chart section
 */

export default function MonthlyOwnershipChangeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headingId = useId();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    'http://hefti-data-api.ddev.site:3000/api';

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/ownership-change-volume`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err.message || 'Failed to load ownership change volume.');
        setData([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [API_BASE_URL]);

  return (
    <section aria-labelledby={headingId}>
      <div>
        <div className="mb-4">
          <Heading id={headingId} level={3}>
            Monthly SNF Ownership Change Volume (2024-2025)
          </Heading>
        </div>

        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <>
            <ErrorBanner
              title="Chart data unavailable"
              message="Ownership change data couldn't be fetched. Try refreshing the page."
            />
            <div className="pointer-events-none select-none opacity-60 mt-4">
              <ChartSkeleton error />
            </div>
          </>
        ) : (
          <ParentSize>
            {({ width }) => <Chart width={width} height={600} data={data} />}
          </ParentSize>
        )}
      </div>
    </section>
  );
}

function Chart({ width, height, data }) {
  const margin = { top: 20, right: 120, bottom: 20, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const chartId = useId();
  const titleId = `${chartId}-title`;
  const descId = `${chartId}-desc`;

  //Responsive settings for SVG
  const isMobile = width < 800;
  //Font size
  const responsiveFontSize = isMobile ? 12 : 16;
  //X axis positioning of month label
  const monthXLabel = isMobile ? 62 : 50;
  //X axis positioning of facilities ownership change label
  const textXLabel = isMobile ? -20 : 20;
  const lineXlabel2 = isMobile ? width - 35 : 500;
  //X axis positioning of specific month column list items
  const monthXListItems = isMobile ? -35 : -10;
  //X axis positioning of bars
  const barXListItems = isMobile ? -20 : 20;
  const isPeakOrLowestX = isMobile ? 10 : 30;
  const peakMonth = data.find((d) => d.indicator === 'PEAK');
  const lowestMonth = data.find((d) => d.indicator === 'LOWEST');

  // Scales
  const yScale = scaleBand({
    domain: data.map((d) => d.month),
    padding: 0.25,
    range: [0, innerHeight],
  });

  const xScale = scaleLinear({
    domain: [0, Math.max(0, ...data.map((d) => d.count))],
    range: [0, innerWidth],
    nice: true,
  });

  return (
    <div className="bg-core-white border-border-primary overflow-hidden rounded-xl border p-4 shadow-sm sm:p-6">
      <p id={descId} className="sr-only">
        Horizontal bar chart showing monthly counts of facilities with
        ownership changes in 2024 and 2025.
        {peakMonth
          ? ` Peak month: ${peakMonth.month} with ${peakMonth.count} ownership changes.`
          : ''}
        {lowestMonth
          ? ` Lowest month: ${lowestMonth.month} with ${lowestMonth.count} ownership changes.`
          : ''}
      </p>
      <svg
        width={width}
        height={height}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <title id={titleId}>Monthly SNF ownership change volume chart</title>

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
          fill="#000"
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
          {data.map((d) => {
            const barWidth = xScale(d.count);
            const barY = yScale(d.month);
            const barHeight = yScale.bandwidth();
            const isPeak = d.indicator === 'PEAK';
            const isLowest = d.indicator === 'LOWEST';
            const barchartWidth = isMobile ? barWidth + 20 : barWidth;

            return (
              <Group key={d.month}>
                <title>
                  {`${d.month}: ${d.count} facilities${
                    isPeak ? ', peak month' : ''
                  }${isLowest ? ', lowest month' : ''}`}
                </title>

                {/* Bar */}
                <Bar
                  x={barXListItems}
                  y={barY}
                  width={barchartWidth}
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

                {/*Peak Marker*/}
                {isPeak && (
                  <Text
                    x={barWidth + isPeakOrLowestX}
                    y={barY + barHeight / 2}
                    verticalAnchor="middle"
                    textAnchor="start"
                    fontSize={responsiveFontSize}
                    fontWeight={600}
                    fill="#000"
                  >
                    PEAK
                  </Text>
                )}
                {/*Lowest Marker*/}
                {isLowest && (
                  <Text
                    x={barWidth + isPeakOrLowestX}
                    y={barY + barHeight / 2}
                    verticalAnchor="middle"
                    textAnchor="start"
                    fontSize={responsiveFontSize}
                    fontWeight={600}
                    fill="#000"
                  >
                    LOWEST
                  </Text>
                )}
              </Group>
            );
          })}
        </Group>
      </svg>

      <div className="sr-only">
        <table>
          <caption>Monthly ownership change counts</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Ownership changes</th>
              <th scope="col">Indicator</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month}>
                <th scope="row">{row.month}</th>
                <td>{row.count}</td>
                <td>{row.indicator || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Chart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      indicator: PropTypes.string,
    }),
  ).isRequired,
};
