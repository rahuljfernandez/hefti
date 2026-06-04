import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from 'recharts';

/**
 * ResearchChart — chart rendering for the Hefti Researcher right panel.
 *
 * This file houses all Recharts-based view components used in the Researcher.
 * Each view (BarView, ComparisonBarView, ScatterView, DistributionView,
 * KpiRowView, TableView) handles one chart type and receives a `data` prop
 * shaped to its needs. Views are internal — they are never rendered directly.
 *
 * The VIEWS registry maps `chart_type` strings from the API response to their
 * view component. The exported `ResearchChart` component is the single entry
 * point: it receives a chart object, looks up the right view from the registry,
 * and wraps it in ChartWrapper (the shared card shell with title and border).
 *
 * To add a new chart type: build a view component, add it to VIEWS, and the
 * LLM response just needs to return the matching `chart_type` key. New view
 * components must use Hefti design tokens (colors, typography, spacing) rather
 * than hardcoded Tailwind zinc/hex values — use existing views as the reference.
 */

// Recharts accepts only hex/rgb — CSS variables are not supported in its prop
// system. These constants are manually kept in sync with the Hefti tokens they
// correspond to; update both if the design system palette changes.
const CHART_GRID_COLOR = '#71717a'; // --content-secondary (zinc-500)
const CHART_AXIS_COLOR = '#09090b'; // --content-primary (zinc-950)
// SVG text does not inherit CSS font-family — Inter must be set explicitly.
const CHART_TICK_STYLE = {
  fontSize: 11,
  fill: CHART_AXIS_COLOR,
  fontFamily: 'Inter, sans-serif',
};

const COLORS = [
  '#60a5fa', // blue-400   — home page accent, subject series (This owner / This facility)
  '#7c3aed', // violet-600 — home page accent, benchmark series (National avg / State avg)
  '#0891b2', // cyan-600   — tertiary series
];

//The Recharts code lives inside the individual view components (BarView, ComparisonBarView, etc.) which get passed in as children. ChartWrapper just wraps them in the card with the border and title.
function ChartWrapper({ title, description, children }) {
  return (
    <div className="border-border-primary overflow-hidden rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-label-lg text-core-black">{title}</p>
      {description && (
        <p className="text-paragraph-base text-content-secondary mt-1">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

ChartWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function BarView({ data }) {
  const bars = data.bars ?? data.items ?? [];
  const normalized = bars.map((b) => ({
    label: b.label ?? b.name,
    value: b.value,
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={normalized}
        margin={{ top: 4, right: 8, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis
          dataKey="label"
          tick={CHART_TICK_STYLE}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={CHART_TICK_STYLE} />
        <Tooltip />
        <Bar dataKey="value" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

BarView.propTypes = {
  data: PropTypes.shape({
    bars: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

function ComparisonBarView({ data }) {
  const { categories = [], series = [] } = data;
  const normalized = categories.map((cat, i) => {
    const row = { category: cat };
    series.forEach((s) => {
      row[s.name] = s.values?.[i] ?? s.data?.[i];
    });
    return row;
  });
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={normalized}
        margin={{ top: 4, right: 8, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis
          dataKey="category"
          tick={CHART_TICK_STYLE}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={CHART_TICK_STYLE} />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '12px' }} />
        {series.map((s, i) => (
          <Bar
            key={s.name}
            dataKey={s.name}
            fill={COLORS[i % COLORS.length]}
            radius={[3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

ComparisonBarView.propTypes = {
  data: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.number),
        data: PropTypes.arrayOf(PropTypes.number),
      }),
    ),
  }).isRequired,
};

function ScatterView({ data }) {
  const points = data.points ?? [];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis dataKey="x" name={data.xLabel ?? 'x'} tick={CHART_TICK_STYLE} />
        <YAxis dataKey="y" name={data.yLabel ?? 'y'} tick={CHART_TICK_STYLE} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={points} fill={COLORS[0]} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

ScatterView.propTypes = {
  data: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object),
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
  }).isRequired,
};

function DistributionView({ data }) {
  const bins = data.bins ?? data.bars ?? data.items ?? [];
  const normalized = bins.map((b) => ({
    label: b.range ?? b.label ?? b.name,
    value: b.count ?? b.value,
  }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={normalized}
        margin={{ top: 4, right: 8, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis
          dataKey="label"
          tick={CHART_TICK_STYLE}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={CHART_TICK_STYLE} />
        <Tooltip />
        <Bar dataKey="value" fill={COLORS[1]} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

DistributionView.propTypes = {
  data: PropTypes.shape({
    bins: PropTypes.arrayOf(PropTypes.object),
    bars: PropTypes.arrayOf(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

function KpiRowView({ data }) {
  const kpis = data.kpis ?? [];
  return (
    <div className="grid grid-cols-2 gap-3">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="border-border-primary bg-background-secondary rounded-md border p-3 shadow-sm"
        >
          <p className="text-core-black text-label-base">{kpi.label}</p>
          <p className="text-core-black text-heading-xs mt-1">
            {kpi.value}
            {kpi.unit ? (
              <span className="text-content-secondary text-label-sm ml-1">
                {kpi.unit}
              </span>
            ) : null}
          </p>

          {kpi.delta && (
            <p className="text-content-secondary text-label-base mt-0.5">
              {kpi.delta}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

KpiRowView.propTypes = {
  data: PropTypes.shape({
    kpis: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
        delta: PropTypes.string,
      }),
    ),
  }).isRequired,
};

function TableView({ data }) {
  const rows = data.rows ?? [];
  if (!rows.length) return null;

  // rows can be array-of-arrays (with a separate columns array)
  // or array-of-objects (columns derived from keys)
  const isArrayRows = Array.isArray(rows[0]);
  const columns = isArrayRows
    ? (data.columns ?? rows[0].map((_, i) => String(i)))
    : Object.keys(rows[0]);

  const getCell = (row, col, i) =>
    isArrayRows ? (row[i] ?? '—') : (row[col] ?? '—');

  return (
    <div className="overflow-x-auto">
      <table className="text-paragraph-xs w-full text-left">
        <thead>
          <tr className="border-border-primary border-b">
            {columns.map((col) => (
              <th
                key={col}
                className="text-label-sm pr-4 pb-2 whitespace-nowrap capitalize"
              >
                {String(col).replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-border-secondary border-b last:border-0"
            >
              {columns.map((col, j) => (
                <td
                  key={col}
                  className="text-content-tertiary py-2 pr-4 whitespace-nowrap"
                >
                  {getCell(row, col, j)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableView.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

// Registry mapping chart_type strings (from the API response) to their view
// components. To add a new chart type: create a view component above, add it
// here, and the LLM response just needs to include the matching chart_type key.
const VIEWS = {
  bar: BarView,
  comparison_bar: ComparisonBarView,
  scatter: ScatterView,
  distribution: DistributionView,
  kpi_row: KpiRowView,
  table: TableView,
};

// Entry point — receives a single chart object, looks up the right view from
// the VIEWS registry, and wraps it in ChartWrapper. Returns null for unknown
// chart types so unrecognized LLM output fails silently rather than crashing.
export default function ResearchChart({ chart }) {
  const { chart_type, title, description, data } = chart;
  const View = VIEWS[chart_type];
  if (!View) return null;
  return (
    <ChartWrapper title={title} description={description}>
      <View data={data} />
    </ChartWrapper>
  );
}

ResearchChart.propTypes = {
  chart: PropTypes.shape({
    chart_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    data: PropTypes.object.isRequired,
  }).isRequired,
};
