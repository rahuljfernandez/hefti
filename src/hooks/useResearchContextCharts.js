import { useEffect, useRef, useState } from 'react';
import { buildContextCharts } from '../lib/contextChart';
import { toTitleCase } from '../lib/toTitleCase';

/* The on-load context chart pulls subject + national data from the regular data
   API (the same endpoints the profile pages use), which is a separate env var
   from the researcher stream. */
const DATA_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

/**
 * Seeds the right panel with an on-load comparison bar chart (CMS Star Ratings)
 * before the user sends any messages, and resolves the subject's display name.
 *
 * Fetches the subject + national ratings from the URL so it stays correct on
 * reload and shared links. The `prev.length ? prev : contextCharts` guard makes
 * a late fetch a no-op once any chart exists, so it can't clobber streamed
 * charts.
 *
 * Owns:
 * - `subjectName`: the owner/facility display name, used as the title of the
 *   "Full session (PDF)" research brief
 * - `contextChartCountRef`: count of on-load charts, used to position the
 *   session-start divider between baseline and AI-generated charts
 * - `chartCountRef`: a synchronous mirror of the total chart count, seeded here
 *   and incremented by the stream hook (setCharts is batched/async, so the
 *   closed-over `charts` value can be stale when a turn finishes streaming)
 */
export default function useResearchContextCharts({
  slug,
  contextType,
  setCharts,
}) {
  const [subjectName, setSubjectName] = useState('');
  const contextChartCountRef = useRef(0);
  const chartCountRef = useRef(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const subjectPath =
      contextType === 'owner'
        ? `owners/${encodeURIComponent(slug)}`
        : `facilities/${slug}`;

    Promise.all([
      fetch(`${DATA_API_BASE_URL}/${subjectPath}`).then((response) =>
        response.ok ? response.json() : null,
      ),
      fetch(`${DATA_API_BASE_URL}/national`)
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null),
    ])
      .then(([subject, national]) => {
        if (cancelled || !subject) return;
        const resolvedSubjectName =
          contextType === 'owner'
            ? toTitleCase(subject.cms_ownership_name)
            : toTitleCase(subject.provider_name);
        setSubjectName(resolvedSubjectName);
        /* Normalizes the differing facility/owner rating fields into the on-load
           comparison bar chart. See lib/contextChart. */
        const contextCharts = buildContextCharts({
          contextType,
          subject,
          national,
          subjectName: resolvedSubjectName,
        });
        if (contextCharts.length) {
          contextChartCountRef.current = contextCharts.length;
          chartCountRef.current = contextCharts.length;
          setCharts((prev) => (prev.length ? prev : contextCharts));
        }
      })
      // The on-load chart is non-critical; leave the panel empty on failure.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, contextType, setCharts]);

  return { subjectName, contextChartCountRef, chartCountRef };
}
