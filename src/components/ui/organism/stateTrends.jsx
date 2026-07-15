import React from 'react';
import PropTypes from 'prop-types';
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import LayoutCard from '../atom/layout-card';
import { Heading } from '../atom/heading';
import { Badge } from '../atom/badge';
import {
  buildStateTrends,
  formatTrendChange,
} from '../../../lib/stateTrendsMetrics';

/**
 * State 5-Year Trends.
 *
 * One sparkline row per rating metric: five year-points connected left to right,
 * each labelled with its value inside an oval, plus the five-year change.
 *
 * Built as raw SVG rather than Recharts (used elsewhere in the app) because the
 * four rows must share exact year columns with the header row and the change
 * column. Four separate ResponsiveContainers with hidden axes and custom
 * dots/labels would not hold that alignment.
 *
 * The x coordinates are SVG percentages, which resolve against the rendered
 * width — so the plot is fluid while the ovals stay a fixed pixel size and the
 * value text stays at its intended size. Note that <polyline points> does NOT
 * accept percentages, which is why the connecting line is drawn as individual
 * <line> segments.
 */

const ROW_HEIGHT = 80;
// Vertical breathing room so the top and bottom ovals aren't clipped by the row.
const ROW_PADDING = 22;
/* Horizontal inset, in percent, keeping the first and last ovals off the plot's
   edges. The oval is ~28px wide, so this also stops it colliding with the
   metric label and change columns. */
const EDGE_INSET = 6;

const OVAL_RX = 18;
const OVAL_RY = 12;

/* Evenly spaces points across the plot as a percentage string. A lone point
   would divide by zero, so it centers instead. */
function xPercent(index, count) {
  if (count <= 1) return '50%';
  return `${EDGE_INSET + ((100 - EDGE_INSET * 2) * index) / (count - 1)}%`;
}

/* Each row scales to its own min/max rather than a shared 1-5 domain: the
   year-over-year moves are a few tenths, which would read as a flat line
   against the full star range. The trade-off is that rows are not vertically
   comparable to each other — the value labels carry the absolute numbers. */
function yFor(value, min, max) {
  if (max === min) return ROW_HEIGHT / 2;
  const ratio = (value - min) / (max - min);
  return ROW_PADDING + (1 - ratio) * (ROW_HEIGHT - ROW_PADDING * 2);
}

const CHANGE_BADGE = {
  up: { color: 'green', Icon: ArrowUpRightIcon },
  down: { color: 'red', Icon: ArrowDownRightIcon },
  flat: { color: 'zinc', Icon: MinusIcon },
};

// Shared column geometry — the header and every row use this so they stay aligned.
const GRID_COLS =
  'grid grid-cols-[5rem_1fr_4.5rem] md:grid-cols-[7rem_1fr_6rem]';

function TrendSparkline({ metric }) {
  const { points } = metric;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <svg width="100%" height={ROW_HEIGHT} aria-hidden="true" focusable="false">
      {/* Connecting line first so the ovals sit on top of it. */}
      {points.slice(1).map((point, i) => (
        <line
          key={point.year}
          x1={xPercent(i, points.length)}
          y1={yFor(points[i].value, min, max)}
          x2={xPercent(i + 1, points.length)}
          y2={yFor(point.value, min, max)}
          strokeWidth={2}
          className="stroke-content-primary"
        />
      ))}

      {points.map((point, i) => (
        <g key={point.year}>
          <ellipse
            cx={xPercent(i, points.length)}
            cy={yFor(point.value, min, max)}
            rx={OVAL_RX}
            ry={OVAL_RY}
            strokeWidth={1.5}
            className="fill-white stroke-amber-500"
          />
          <text
            x={xPercent(i, points.length)}
            y={yFor(point.value, min, max)}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-core-black text-xs font-bold"
          >
            {point.value.toFixed(1)}
          </text>
        </g>
      ))}
    </svg>
  );
}

TrendSparkline.propTypes = {
  metric: PropTypes.shape({
    points: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

function TrendRow({ metric }) {
  const { color, Icon } = CHANGE_BADGE[metric.direction];

  return (
    <div className={`${GRID_COLS} items-center`}>
      <span className="text-label-base text-core-black">{metric.label}</span>
      <TrendSparkline metric={metric} />
      <Badge color={color} className="justify-center gap-x-2 py-1.5">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {formatTrendChange(metric.change)}
      </Badge>
    </div>
  );
}

TrendRow.propTypes = {
  metric: PropTypes.shape({
    label: PropTypes.string.isRequired,
    change: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['up', 'down', 'flat']).isRequired,
  }).isRequired,
};

/* Screen-reader equivalent of the chart. The SVG rows are aria-hidden, so this
   table is the only accessible path to the numbers. */
function TrendTable({ years, metrics }) {
  return (
    <table className="sr-only">
      <caption>Five-year star rating trends by metric</caption>
      <thead>
        <tr>
          <th scope="col">Metric</th>
          {years.map((year) => (
            <th key={year} scope="col">
              {year}
            </th>
          ))}
          <th scope="col">5-year change</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => (
          <tr key={metric.key}>
            <th scope="row">{metric.label}</th>
            {metric.points.map((point) => (
              <td key={point.year}>{point.value.toFixed(1)}</td>
            ))}
            <td>{formatTrendChange(metric.change)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TrendTable.propTypes = {
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  metrics: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function StateTrends() {
  const data = buildStateTrends();
  if (!data) return null;

  const { years, metrics } = data;

  return (
    <section>
      <Heading level={3} className="text-heading-sm mt-8 mb-4 font-bold">
        5-Year Trends
      </Heading>

      <LayoutCard>
        {/* Column headers. The year labels are positioned on the same
            percentages the sparkline plots its points at, so they stay over
            their columns at any width. */}
        <div className={`${GRID_COLS} items-center`}>
          <span className="text-label-xs text-content-secondary">Metric</span>
          <div className="relative h-5">
            {years.map((year, i) => (
              <span
                key={year}
                className="text-label-xs text-content-secondary absolute -translate-x-1/2"
                style={{ left: xPercent(i, years.length) }}
              >
                {year}
              </span>
            ))}
          </div>
          <span className="text-label-xs text-content-secondary text-center">
            5-year change
          </span>
        </div>

        {/* border-b closes off the last row — divide-y only draws between rows. */}
        <div className="divide-border-primary border-border-primary divide-y border-b">
          {metrics.map((metric) => (
            <TrendRow key={metric.key} metric={metric} />
          ))}
        </div>

        <TrendTable years={years} metrics={metrics} />

        <p className="text-paragraph-xs text-content-tertiary mt-4">
          Footnote: CMS revised the 5 Star-methodology during this window,
          figures aren&apos;t perfectly comparable across rebaselines.
        </p>
      </LayoutCard>
    </section>
  );
}
