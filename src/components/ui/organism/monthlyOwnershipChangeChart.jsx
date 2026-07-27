import React, { useEffect, useState, useId } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
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

const CHART_HEIGHT = 404;
const CHART_MARGIN = { top: 0, right: 6, bottom: 8, left: 6 };
const BAR_SIZE = 16;
/* Bars cap short of the value gutter so the longest never crowds the numbers. */
const BAR_FILL_RATIO = 0.88;

/* Left gutter holds the month label; right gutter holds the pill + value. */
const MONTH_AXIS_WIDTH = 56;
const VALUE_AXIS_WIDTH = 150;
const MOBILE_MONTH_AXIS_WIDTH = 44;
const MOBILE_VALUE_AXIS_WIDTH = 52;

/* zinc ramp — bar shade encodes rank, pill/value shade encodes emphasis. */
const RAIL_FILL = '#f4f4f5'; // zinc-100
const BAR_FILL = '#3f3f46'; // zinc-700
const BAR_FILL_PEAK = '#09090b'; // zinc-950
const BAR_FILL_LOWEST = '#d4d4d8'; // zinc-300
const TEXT_MUTED = '#71717a'; // zinc-500
const TEXT_STRONG = '#09090b'; // zinc-950

const PILL_HEIGHT = 18;
const PILL_GAP = 12; // between pill and the value column
const VALUE_COL_WIDTH = 44; // room for a 4-digit, comma-grouped value
/* SVG text has no auto-sizing, so the two possible labels get fixed widths. */
const PILL = {
  PEAK: {
    label: 'Peak',
    width: 44,
    fill: '#27272a',
    text: '#ffffff',
    stroke: 'none',
  },
  LOWEST: {
    label: 'Lowest',
    width: 56,
    fill: '#f4f4f5',
    text: '#71717a',
    stroke: '#e4e4e7',
  },
};

function barFill(indicator) {
  if (indicator === 'PEAK') return BAR_FILL_PEAK;
  if (indicator === 'LOWEST') return BAR_FILL_LOWEST;
  return BAR_FILL;
}

const dataItemShape = PropTypes.shape({
  month: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  indicator: PropTypes.string,
});

/**
 * Left Y-axis tick: the month label, anchored to the gutter's left edge, in a
 * uniform muted tone across every row.
 *
 * @param {object} props
 * @param {number} props.x - SVG x coordinate provided by Recharts.
 * @param {number} props.y - SVG y coordinate provided by Recharts.
 * @param {{ value: string }} props.payload - Tick payload from Recharts (month string).
 * @param {number} props.axisWidth - Width of the Y-axis gutter, so the label
 *   anchors to its left edge (varies between desktop and mobile layouts).
 */
function MonthTick({ x, y, payload, axisWidth }) {
  return (
    <text
      x={x - axisWidth + 5}
      y={y}
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={13}
      fontWeight={500}
      fill={TEXT_MUTED}
    >
      {payload.value}
    </text>
  );
}

MonthTick.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  payload: PropTypes.shape({ value: PropTypes.string }).isRequired,
  axisWidth: PropTypes.number.isRequired,
};

/**
 * Right Y-axis tick: the count value flush-right, preceded (on desktop) by a
 * Peak/Lowest pill in its own column. The pill is decorative — the indicator is
 * already conveyed by the sr-only description and data table — so it is hidden
 * from assistive tech. Numbers are comma-grouped and tabular for a clean column.
 *
 * @param {object} props
 * @param {number} props.x - Tick x (left edge of the right gutter) from Recharts.
 * @param {number} props.y - Tick y from Recharts.
 * @param {{ value: string }} props.payload - Tick payload (month string).
 * @param {Array<{month: string, count: number, indicator?: string}>} props.data - Full dataset.
 * @param {number} props.axisWidth - Width of the right gutter.
 * @param {boolean} props.showPill - Whether to draw the pill (dropped on mobile).
 */
function ValueTick({ x, y, payload, data: chartData, axisWidth, showPill }) {
  const entry = chartData?.find((d) => d.month === payload.value);
  if (!entry) return null;

  const emphasised = entry.indicator === 'PEAK' || entry.indicator === 'LOWEST';
  const valueRightX = x + axisWidth - 4;
  const pill = showPill ? PILL[entry.indicator] : undefined;

  return (
    <g>
      {pill && (
        <g aria-hidden="true">
          <rect
            x={valueRightX - VALUE_COL_WIDTH - PILL_GAP - pill.width}
            y={y - PILL_HEIGHT / 2}
            width={pill.width}
            height={PILL_HEIGHT}
            rx={PILL_HEIGHT / 2}
            fill={pill.fill}
            stroke={pill.stroke}
          />
          <text
            x={valueRightX - VALUE_COL_WIDTH - PILL_GAP - pill.width / 2}
            y={y + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill={pill.text}
          >
            {pill.label}
          </text>
        </g>
      )}
      <text
        x={valueRightX}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={emphasised ? 700 : 500}
        fill={TEXT_STRONG}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {entry.count.toLocaleString()}
      </text>
    </g>
  );
}

ValueTick.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  payload: PropTypes.shape({ value: PropTypes.string }).isRequired,
  data: PropTypes.arrayOf(dataItemShape).isRequired,
  axisWidth: PropTypes.number.isRequired,
  showPill: PropTypes.bool.isRequired,
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
  const monthAxisWidth = isMobile ? MOBILE_MONTH_AXIS_WIDTH : MONTH_AXIS_WIDTH;
  const valueAxisWidth = isMobile ? MOBILE_VALUE_AXIS_WIDTH : VALUE_AXIS_WIDTH;
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
        aria-label="Monthly SNF ownership change volume"
        aria-describedby={descId}
      >
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart
            layout="vertical"
            data={data}
            margin={CHART_MARGIN}
            accessibilityLayer={false}
          >
            <XAxis
              type="number"
              hide
              domain={[0, (dataMax) => Math.ceil(dataMax / BAR_FILL_RATIO)]}
            />
            <YAxis
              yAxisId="month"
              type="category"
              dataKey="month"
              width={monthAxisWidth}
              tick={(tickProps) => (
                <MonthTick {...tickProps} axisWidth={monthAxisWidth} />
              )}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="value"
              orientation="right"
              type="category"
              dataKey="month"
              width={valueAxisWidth}
              tick={(tickProps) => (
                <ValueTick
                  {...tickProps}
                  data={data}
                  axisWidth={valueAxisWidth}
                  showPill={!isMobile}
                />
              )}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              yAxisId="month"
              dataKey="count"
              barSize={BAR_SIZE}
              radius={4}
              isAnimationActive={false}
              background={{ fill: RAIL_FILL, radius: 4 }}
            >
              {data.map((entry) => (
                <Cell key={entry.month} fill={barFill(entry.indicator)} />
              ))}
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
