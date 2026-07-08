import React, { useEffect, useState, useId } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { ChartSkeleton } from '../atom/skeletons';
import { ErrorBanner } from '../atom/errorBanner';
import { useIsMobile } from '../../../hooks/useIsMobile';

/**
 * @fileoverview Monthly SNF Ownership Change Volume chart.
 *
 * Fetches ownership-change-volume data from the API and renders a horizontal
 * bar chart with accessible fallbacks: a visually-hidden description paragraph,
 * a screen-reader-only data table, and ARIA roles on the SVG wrapper.
 */

const Y_AXIS_WIDTH = 130;
const CHART_MARGIN = { top: 0, right: 120, bottom: 20, left: 10 };

/* Mobile geometry for narrow cards below the md breakpoint we swap these in. */
const MOBILE_Y_AXIS_WIDTH = 88;
const MOBILE_CHART_MARGIN = { top: 0, right: 64, bottom: 20, left: 4 };

const dataItemShape = PropTypes.shape({
  month: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  indicator: PropTypes.string,
});

/**
 * Custom Y-axis tick that renders the month label on the left and its count
 * value flush-right, aligned with the bar start.
 *
 * @param {object} props
 * @param {number} props.x - SVG x coordinate provided by Recharts.
 * @param {number} props.y - SVG y coordinate provided by Recharts.
 * @param {{ value: string }} props.payload - Tick payload from Recharts (month string).
 * @param {Array<{month: string, count: number}>} props.data - Full chart dataset used to look up the count.
 * @param {number} props.axisWidth - Width of the Y-axis gutter, so the month
 *   label anchors to its left edge (varies between desktop and mobile layouts).
 */
function CustomYAxisTick({ x, y, payload, data: chartData, axisWidth }) {
  const entry = chartData?.find((d) => d.month === payload.value);
  return (
    <g>
      <text
        x={x - axisWidth + 5}
        y={y}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={500}
        fill="#000"
      >
        {payload.value}
      </text>
      <text
        x={x - 8}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={500}
        fill="#000"
      >
        {entry?.count ?? ''}
      </text>
    </g>
  );
}

CustomYAxisTick.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  payload: PropTypes.shape({ value: PropTypes.string }).isRequired,
  data: PropTypes.arrayOf(dataItemShape).isRequired,
  axisWidth: PropTypes.number.isRequired,
};

/**
 * SVG label rendered to the right of a bar when a data point is flagged as
 * PEAK or LOWEST. Hidden from assistive technology because the indicator is
 * already conveyed via the sr-only description and data table.
 *
 * @param {object} props - Injected by Recharts LabelList.
 * @param {number} props.x - Bar x position.
 * @param {number} props.y - Bar y position.
 * @param {number} props.width - Bar width.
 * @param {number} props.height - Bar height.
 * @param {string} [props.value] - Label text ("PEAK" | "LOWEST"), or falsy to render nothing.
 */
function PeakLowestLabel({ x, y, width, height, value }) {
  if (!value) return null;
  return (
    <text
      aria-hidden="true"
      x={x + width + 8}
      y={y + height / 2}
      dominantBaseline="middle"
      textAnchor="start"
      fontSize={13}
      fontWeight={600}
      fill="#000"
    >
      {value}
    </text>
  );
}

PeakLowestLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  value: PropTypes.string,
};

/**
 * Accessible horizontal bar chart container. Wraps the Recharts BarChart with:
 * - A visually-hidden prose description (peak/lowest callouts).
 * - A sr-only data table so screen readers can navigate individual values.
 *
 * @param {object} props
 * @param {Array<{month: string, count: number, indicator?: string}>} props.data - Sorted monthly data points.
 */
function Chart({ data }) {
  const chartId = useId();
  const descId = `${chartId}-desc`;
  const isMobile = useIsMobile(768);
  const yAxisWidth = isMobile ? MOBILE_Y_AXIS_WIDTH : Y_AXIS_WIDTH;
  const chartMargin = isMobile ? MOBILE_CHART_MARGIN : CHART_MARGIN;
  const peakMonth = data.find((d) => d.indicator === 'PEAK');
  const lowestMonth = data.find((d) => d.indicator === 'LOWEST');

  return (
    <div className="overflow-hidden">
      <p id={descId} className="sr-only">
        Horizontal bar chart showing monthly counts of facilities with ownership
        changes in recent months.
        {peakMonth
          ? ` Peak month: ${peakMonth.month} with ${peakMonth.count} ownership changes.`
          : ''}
        {lowestMonth
          ? ` Lowest month: ${lowestMonth.month} with ${lowestMonth.count} ownership changes.`
          : ''}
      </p>

      <div
        role="img"
        aria-describedby={descId}
        className="rounded-lg bg-gray-200 px-3 py-4 md:px-6"
      >
        <ResponsiveContainer width="100%" height={580}>
          <BarChart
            layout="vertical"
            data={data}
            margin={chartMargin}
            barCategoryGap="25%"
          >
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="month"
              width={yAxisWidth}
              tick={(tickProps) => (
                <CustomYAxisTick
                  {...tickProps}
                  data={data}
                  axisWidth={yAxisWidth}
                />
              )}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="count"
              fill="#1f2937"
              radius={4}
              isAnimationActive={false}
            >
              <LabelList dataKey="indicator" content={PeakLowestLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

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
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      indicator: PropTypes.string,
    }),
  ).isRequired,
};

/**
 * Top-level data-fetching component for the monthly ownership change chart.
 * Manages fetch lifecycle (loading / error / success) and renders the
 * appropriate state: skeleton, error banner, or the Chart. Renders bare (no
 * card chrome) so its container — the trending carousel — supplies the card and
 * title.
 *
 * @returns {JSX.Element}
 */
export default function MonthlyOwnershipChangeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const body = loading ? (
    <ChartSkeleton />
  ) : error ? (
    <>
      <ErrorBanner
        title="Chart data unavailable"
        message="Ownership change data couldn't be fetched. Try refreshing the page."
      />
      <div className="pointer-events-none mt-4 opacity-60 select-none">
        <ChartSkeleton error />
      </div>
    </>
  ) : (
    <Chart data={data} />
  );

  return (
    <section aria-label="Monthly SNF ownership change volume">{body}</section>
  );
}
