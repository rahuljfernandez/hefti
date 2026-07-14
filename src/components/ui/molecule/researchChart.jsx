import React, { useRef } from 'react';
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
import { TableCellsIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ShareButton, ShareButtonRow, HoverReveal } from './shareability';
import {
  downloadChartCsv,
  downloadChartPng,
} from '../../../lib/shareability/researcher/chartExport';

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

/* Recharts accepts only hex/rgb — CSS variables are not supported in its prop
   system. These constants are manually kept in sync with the Hefti tokens they
   correspond to; update both if the design system palette changes. */
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

// Max chars before X-axis labels are truncated; keeps bottom margin predictable.
const MAX_LABEL_CHARS = 21;

/* Computes top and bottom chart margins from actual label strings.
   Bottom scales with the longest label (angle 35° × avg char width). Top stays
   proportional so the chart looks balanced regardless of label length. */
function xMargins(labels) {
  const maxLen = Math.min(
    Math.max(...labels.map((l) => String(l).length), 0),
    MAX_LABEL_CHARS,
  );
  const bottom = Math.max(20, Math.ceil(maxLen * 3.5) + 8);
  return { top: Math.max(8, Math.ceil(bottom * 0.3)), bottom };
}

/* Custom X-axis tick that truncates long labels and handles rotation internally.
   Recharts' `angle` / `textAnchor` XAxis props only affect the built-in tick —
   a custom tick component must manage both itself. */
function ChartXTick({ x, y, payload }) {
  const raw = String(payload?.value ?? '');
  const label =
    raw.length > MAX_LABEL_CHARS ? `${raw.slice(0, MAX_LABEL_CHARS)}…` : raw;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        fontSize={CHART_TICK_STYLE.fontSize}
        fill={CHART_TICK_STYLE.fill}
        fontFamily={CHART_TICK_STYLE.fontFamily}
        textAnchor="end"
        transform="rotate(-35)"
      >
        {label}
      </text>
    </g>
  );
}

ChartXTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

//The Recharts code lives inside the individual view components (BarView, ComparisonBarView, etc.) which get passed in as children. ChartWrapper just wraps them in the card with the border and title.
function ChartWrapper({
  title,
  description,
  children,
  chart,
  isLatest,
  onCardMount,
}) {
  const cardRef = useRef(null);
  function handleDownloadCsv() {
    return downloadChartCsv(chart, chartToRows);
  }

  function handleDownloadPng() {
    return downloadChartPng(cardRef.current, chart);
  }

  return (
    <div className="group">
      <div
        ref={(el) => {
          cardRef.current = el;
          onCardMount?.(el);
        }}
        className="border-border-primary overflow-hidden rounded-lg border bg-white p-4 shadow-sm"
      >
        <p className="text-label-lg text-core-black">{title}</p>
        {description && (
          <p className="text-paragraph-base text-content-secondary mt-1">
            {description}
          </p>
        )}
        <div className="mt-4">{children}</div>
      </div>
      <HoverReveal show={isLatest} className="mt-3">
        <ShareButtonRow>
          <ShareButton
            icon={PhotoIcon}
            label="Download PNG"
            onClick={handleDownloadPng}
          />
          <ShareButton
            icon={TableCellsIcon}
            label="Download data as CSV"
            onClick={handleDownloadCsv}
          />
        </ShareButtonRow>
      </HoverReveal>
    </div>
  );
}

ChartWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  isLatest: PropTypes.bool,
  chart: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onCardMount: PropTypes.func,
};

/* Shared shape-unwrapping helpers — used by both the View that renders a
   chart_type and the matching case in chartToRows below, so the LLM's
   field-naming fallbacks (e.g. `bars` vs `items`) only have to be encoded
   once per chart_type instead of drifting between render and CSV export. */
function normalizeBarItems(data) {
  const items = data.bars ?? data.items ?? [];
  return items.map((item) => ({
    label: item.label ?? item.name,
    value: item.value,
  }));
}

function normalizeDistributionItems(data) {
  const items = data.bins ?? data.bars ?? data.items ?? [];
  return items.map((item) => ({
    label: item.range ?? item.label ?? item.name,
    value: item.count ?? item.value,
  }));
}

function seriesValueAt(series, i) {
  return series.values?.[i] ?? series.data?.[i];
}

function normalizeTableShape(data) {
  const rows = data.rows ?? [];
  if (!rows.length) return { columns: [], rows: [], isArrayRows: false };
  const isArrayRows = Array.isArray(rows[0]);
  const columns = isArrayRows
    ? (data.columns ?? rows[0].map((_, i) => String(i)))
    : Object.keys(rows[0]);
  return { columns, rows, isArrayRows };
}

function BarView({ data }) {
  const normalized = normalizeBarItems(data);
  const { top, bottom } = xMargins(normalized.map((b) => b.label));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={normalized} margin={{ top, right: 8, left: 0, bottom }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis dataKey="label" tick={<ChartXTick />} interval={0} />
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
      row[s.name] = seriesValueAt(s, i);
    });
    return row;
  });
  const { top, bottom } = xMargins(categories);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={normalized} margin={{ top, right: 8, left: 0, bottom }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis dataKey="category" tick={<ChartXTick />} interval={0} />
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
  const normalized = normalizeDistributionItems(data);
  const { top, bottom } = xMargins(normalized.map((b) => b.label));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={normalized} margin={{ top, right: 8, left: 0, bottom }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
        <XAxis dataKey="label" tick={<ChartXTick />} interval={0} />
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
  const { columns, rows, isArrayRows } = normalizeTableShape(data);
  if (!rows.length) return null;

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

/* Registry mapping chart_type strings (from the API response) to their view
   components. To add a new chart type: create a view component above, add it
   here, and the LLM response just needs to include the matching chart_type key. */
const VIEWS = {
  bar: BarView,
  comparison_bar: ComparisonBarView,
  scatter: ScatterView,
  distribution: DistributionView,
  kpi_row: KpiRowView,
  table: TableView,
};

/* Converts a chart's `data` into flat { headers, rows } for CSV export,
   reusing the same per-chart_type unwrap logic as the View components above.
   Lives here (not in shareActions.js) since this file already owns the
   chart_type-to-shape knowledge — shareActions.js stays generic. */
export function chartToRows(chart) {
  const { chart_type, data } = chart;

  switch (chart_type) {
    case 'bar': {
      const items = normalizeBarItems(data);
      return {
        headers: ['Label', 'Value'],
        rows: items.map((item) => [item.label, item.value]),
      };
    }
    case 'distribution': {
      const items = normalizeDistributionItems(data);
      return {
        headers: ['Label', 'Value'],
        rows: items.map((item) => [item.label, item.value]),
      };
    }
    case 'comparison_bar': {
      const { categories = [], series = [] } = data;
      return {
        headers: ['Category', ...series.map((s) => s.name)],
        rows: categories.map((cat, i) => [
          cat,
          ...series.map((s) => seriesValueAt(s, i)),
        ]),
      };
    }
    case 'scatter': {
      const points = data.points ?? [];
      return {
        headers: [data.xLabel ?? 'x', data.yLabel ?? 'y'],
        rows: points.map((p) => [p.x, p.y]),
      };
    }
    case 'kpi_row': {
      const kpis = data.kpis ?? [];
      return {
        headers: ['Label', 'Value', 'Unit', 'Delta'],
        rows: kpis.map((kpi) => [
          kpi.label,
          kpi.value,
          kpi.unit ?? '',
          kpi.delta ?? '',
        ]),
      };
    }
    case 'table': {
      const { columns, rows, isArrayRows } = normalizeTableShape(data);
      if (!rows.length) return { headers: [], rows: [] };
      /* Empty string, not TableView's '—' placeholder — a literal em-dash in
         an otherwise-numeric CSV column would be misread as text by Excel/
         pandas instead of as a missing value. */
      const getCell = (row, col, i) =>
        isArrayRows ? (row[i] ?? '') : (row[col] ?? '');
      return {
        headers: columns,
        rows: rows.map((row) => columns.map((col, j) => getCell(row, col, j))),
      };
    }
    default:
      return { headers: [], rows: [] };
  }
}

/* Entry point — receives a single chart object, looks up the right view from
   the VIEWS registry, and wraps it in ChartWrapper. Returns null for unknown
   chart types so unrecognized LLM output fails silently rather than crashing. */
export default function ResearchChart({ chart, isLatest, onCardMount }) {
  const { chart_type, title, description, data } = chart;
  const View = VIEWS[chart_type];
  if (!View) return null;
  return (
    <ChartWrapper
      title={title}
      description={description}
      chart={chart}
      isLatest={isLatest}
      onCardMount={onCardMount}
    >
      <View data={data} />
    </ChartWrapper>
  );
}

ResearchChart.propTypes = {
  isLatest: PropTypes.bool,
  onCardMount: PropTypes.func,
  chart: PropTypes.shape({
    chart_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    data: PropTypes.object.isRequired,
  }).isRequired,
};
