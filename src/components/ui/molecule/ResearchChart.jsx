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

const COLORS = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#d97706',
  '#7c3aed',
  '#0891b2',
];

//The Recharts code lives inside the individual view components (BarView, ComparisonBarView, etc.) which get passed in as children. ChartWrapper just wraps them in the card with the border and title.
function ChartWrapper({ title, description, children }) {
  return (
    <div className="border-border-primary overflow-hidden rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-label-lg text-core-black">{title}</p>
      {description && (
        <p className="text-paragraph-sm text-content-secondary mt-1">
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#71717a' }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: '#71717a' }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
        <Tooltip />
        <Legend />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="x"
          name={data.xLabel ?? 'x'}
          tick={{ fontSize: 11, fill: '#71717a' }}
        />
        <YAxis
          dataKey="y"
          name={data.yLabel ?? 'y'}
          tick={{ fontSize: 11, fill: '#71717a' }}
        />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#71717a' }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
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
          className="bg-core-white border-border-primary rounded-md border p-3 shadow-sm"
        >
          <p className="text-core-black mt-1 text-xl font-semibold">
            {kpi.value}
            {kpi.unit ? (
              <span className="text-content-secondary text-label-sm ml-1">
                {kpi.unit}
              </span>
            ) : null}
          </p>
          <p className="text-core-black text-label-sm">{kpi.label}</p>
          {kpi.delta && (
            <p className="text-content-secondary text-label-sm mt-0.5">
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
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-zinc-200">
            {columns.map((col) => (
              <th
                key={col}
                className="pr-4 pb-2 font-semibold whitespace-nowrap text-zinc-500 capitalize"
              >
                {String(col).replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100 last:border-0">
              {columns.map((col, j) => (
                <td
                  key={col}
                  className="py-2 pr-4 whitespace-nowrap text-zinc-800"
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

const VIEWS = {
  bar: BarView,
  comparison_bar: ComparisonBarView,
  scatter: ScatterView,
  distribution: DistributionView,
  kpi_row: KpiRowView,
  table: TableView,
};

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
