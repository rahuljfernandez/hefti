/**
 * The four CMS rating dimensions, in display order, with their labels.
 *
 * Shared so every section that lists these metrics (rating distribution, 5-year
 * trends, and any future one) shows the same names in the same order — renaming
 * a label here updates all of them at once instead of letting stacked sections
 * on the same page drift apart.
 *
 * `key` doubles as a data-lookup key. It matches both the `rating_distribution`
 * object the API returns and the trend series in stateTrendsMetrics; those two
 * keyspaces coincide today. If a future data source keys these metrics
 * differently, give it its own key map rather than forking this list — the point
 * of sharing is that the labels never disagree.
 */
export const RATING_METRICS = [
  { key: 'overall', label: 'Overall' },
  { key: 'health_inspection', label: 'Health' },
  { key: 'staffing', label: 'Staffing' },
  { key: 'quality', label: 'Quality' },
];

/**
 * Color-by dimensions for the state choropleth and the facilities map: the four
 * rating dimensions above plus Financial. Single source so both maps' Color-by
 * selectors stay in lockstep — adding or renaming a dimension happens once here.
 * Shape matches TabsSelector's `tabsData` ({ name }).
 */
export const COLOR_BY_DIMENSIONS = [
  { name: 'Overall' },
  { name: 'Health' },
  { name: 'Staffing' },
  { name: 'Quality' },
  { name: 'Financial' },
];
