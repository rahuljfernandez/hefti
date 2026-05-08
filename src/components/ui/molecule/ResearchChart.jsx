import React from 'react';
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

function ChartWrapper({ title, description, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      <p className="text-paragraph-sm text-core-black font-semibold">{title}</p>
      {description && (
        <p className="text-paragraph-sm text-content-secondary mt-1">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

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

function KpiRowView({ data }) {
  const kpis = data.kpis ?? [];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {kpis.map((kpi, i) => (
        <div key={i} className="rounded-lg bg-zinc-50 p-3">
          <p className="text-xs text-zinc-500">{kpi.label}</p>
          <p className="mt-1 text-xl font-semibold text-zinc-900">
            {kpi.value}
            {kpi.unit ? (
              <span className="ml-1 text-sm font-normal text-zinc-500">
                {kpi.unit}
              </span>
            ) : null}
          </p>
          {kpi.delta && (
            <p className="mt-0.5 text-xs text-zinc-400">{kpi.delta}</p>
          )}
        </div>
      ))}
    </div>
  );
}

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
                <td key={col} className="py-2 pr-4 whitespace-nowrap text-zinc-800">
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
