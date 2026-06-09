import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import ResearcherComposer from '../components/ui/molecule/researcherComposer';
import ReactMarkdown from 'react-markdown';
import { MdComponents } from '../lib/mdComponents';
import {
  getResearchPages,
  getRankingsResearchPages,
} from '../lib/breadcrumbPages';
import { Heading } from '../components/ui/atom/heading';
import ResearchChart from '../components/ui/molecule/ResearchChart';
import { buildContextCharts } from '../lib/contextChart';
import { toTitleCase } from '../lib/toTitleCase';
import { OWNER_PROMPTS, FACILITY_PROMPTS } from '../lib/researchPrompts';

const API_BASE_URL =
  import.meta.env.VITE_RESEARCHER_FUNCTION_URL ||
  'http://hefti-data-api.ddev.site:3000/api';

// The researcher stream lives behind VITE_RESEARCHER_FUNCTION_URL, but the
// on-load context chart pulls subject + national data from the regular data API
// (the same endpoints the profile pages use), which is a separate env var.
const DATA_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://hefti-data-api.ddev.site:3000/api';
/**
 * HeftiResearch
 *
 * AI-powered researcher chat page for exploring facility and owner data.
 * Accessible via the CTA on Owner and Facility profile pages.
 *
 * - Derives `contextType` ("owner" | "facility") from the current URL path
 *   so the backend can scope its response to the right entity type.
 * - Streams assistant responses from `POST /api/researcher` using the
 *   Fetch ReadableStream API and renders them with react-markdown.
 * - Keeps a rolling history of the last 20 messages to support multi-turn
 *   conversation without unbounded context growth.
 * - Seeds the right panel with on-load context charts (KPI + comparison bar)
 *   fetched on mount before the user sends any messages.
 *
 * Scroll behavior — both panels pin the newest content to the top of their
 * viewport so each turn starts from the top, but they do it differently because
 * of *when* their anchor element exists:
 *
 * - Left (chat): the anchor is the user's message, which exists the instant they
 *   hit send. So we pin it SYNCHRONOUSLY inside submitPrompt — `flushSync` commits
 *   the message, then a single `requestAnimationFrame` scrolls it to the top.
 *   Room to scroll is made by giving the latest assistant bubble a min-height
 *   (`assistantMinHeight`) equal to ~one viewport.
 * - Right (charts): the anchor is the turn's first chart, which does NOT exist at
 *   send time — charts stream in asynchronously over the response. So we pin
 *   REACTIVELY in a `useEffect` keyed on `charts`, scrolling once that first chart
 *   arrives. Room to scroll is made by a trailing spacer (`chartsSpacerHeight`)
 *   sized to the right panel's full height, which also survives the brief window
 *   before Recharts has measured the incoming chart.
 *
 * Route params:
 *  - slug: string — the owner or facility slug, forwarded to the API for context.
 */
export default function HeftiResearch() {
  const { slug } = useParams();
  const { pathname, state } = useLocation();
  // Derived from the URL rather than a prop because this page is shared by both owner and facility research routes.
  const contextType = pathname.includes('/owners/') ? 'owner' : 'facility';

  // Swaps in rankings breadcrumb trail when arriving via the rankings page.
  const researchPages =
    state?.from === 'rankings'
      ? getRankingsResearchPages(slug, contextType)
      : getResearchPages(slug, contextType);

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [charts, setCharts] = useState([]);
  const [assistantMinHeight, setAssistantMinHeight] = useState(0);
  const [chartsSpacerHeight, setChartsSpacerHeight] = useState(0);
  const messagesContainerRef = useRef(null);
  const lastUserMsgRef = useRef(null);
  const chartsPanelRef = useRef(null);
  // Mirrors lastUserMsgRef on the left: the first chart produced by the current
  // turn, which we pin to the top of the panel once it arrives.
  const turnFirstChartRef = useRef(null);
  // The index the current turn's first chart will occupy, snapshotted at submit
  // (before any new charts have streamed in).
  const turnStartIndexRef = useRef(null);
  // Count of on-load context charts — used to position the session-start divider
  // between the baseline charts and the first AI-generated chart.
  const contextChartCountRef = useRef(0);
  const hasStarted = messages.length > 0;

  // On-load context chart: fetch the subject + national ratings from the
  // URL and seed a comparison chart into the right panel before the user sends
  // anything. Fetching keeps it correct on reload/shared links.
  // The `prev.length ? prev : [chart]` guard makes a late fetch a no-op once any
  // chart exists, so it can't clobber streamed charts.
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
      // National bars are best-effort — resolve to null on failure so the chart
      // can still render the subject's own ratings.
      fetch(`${DATA_API_BASE_URL}/national`)
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null),
    ])
      .then(([subject, national]) => {
        if (cancelled || !subject) return;
        const subjectName =
          contextType === 'owner'
            ? toTitleCase(subject.cms_ownership_name)
            : toTitleCase(subject.provider_name);
        // Normalizes the differing facility/owner rating fields into context
        // charts (KPI grid + bar). See lib/contextChart.
        const contextCharts = buildContextCharts({
          contextType,
          subject,
          national,
          subjectName,
        });
        if (contextCharts.length) {
          contextChartCountRef.current = contextCharts.length;
          setCharts((prev) => (prev.length ? prev : contextCharts));
        }
      })
      // The on-load chart is non-critical; leave the panel empty on failure.
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, contextType]);

  // Left side (chat): tracks the height of the scroll container so we can give the
  // incoming assistant message bubble enough min-height to fill the remaining
  // viewport. This ensures there's always enough scroll depth to push the user
  // message to the top of the view when a new message is sent, even before the
  // assistant has streamed any content. (The right panel's equivalent spacer
  // measurement is the next effect below.)
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    function updateAssistantMinHeight() {
      setAssistantMinHeight(Math.max(container.clientHeight - 120, 0));
    }

    updateAssistantMinHeight();

    const resizeObserver = new ResizeObserver(updateAssistantMinHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [hasStarted]);

  // Right-panel equivalent of the spacer measurement above. We track the chart
  // panel's own full height (it's taller than the left container, which excludes
  // the composer) and use it as a trailing spacer. Sizing the spacer to a full
  // viewport guarantees there's enough scroll depth to pin a new turn's first
  // chart to the top even during the brief window before Recharts has measured
  // and laid out the chart (when it still reports near-zero height).
  useLayoutEffect(() => {
    const panel = chartsPanelRef.current;
    if (!panel) return;

    function updateChartsSpacerHeight() {
      setChartsSpacerHeight(panel.clientHeight);
    }

    updateChartsSpacerHeight();

    const resizeObserver = new ResizeObserver(updateChartsSpacerHeight);
    resizeObserver.observe(panel);

    return () => resizeObserver.disconnect();
  }, []);

  // Right-panel counterpart to the left side's scroll-to-top (see the scroll block
  // in submitPrompt). Unlike the left — which pins synchronously at send time
  // because the user message already exists — charts stream in asynchronously, so
  // we must pin REACTIVELY here: this effect fires when `charts` changes and acts
  // only when the turn's first chart has just arrived (length === startIdx + 1),
  // scrolling it to the top. The trailing spacer in the render guarantees enough
  // scroll depth below it, exactly how assistantMinHeight makes room on the left.
  useEffect(() => {
    const panel = chartsPanelRef.current;
    const startIdx = turnStartIndexRef.current;
    if (!panel || startIdx === null || charts.length !== startIdx + 1) return;

    const frameId = requestAnimationFrame(() => {
      const chart = turnFirstChartRef.current;
      if (!chart) return;

      const panelRect = panel.getBoundingClientRect();
      const chartRect = chart.getBoundingClientRect();
      const topOffset = chartRect.top - panelRect.top;

      panel.scrollTo({
        top: panel.scrollTop + topOffset - 16,
        behavior: 'smooth',
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [charts]);

  async function submitPrompt(override) {
    const trimmedPrompt = (
      typeof override === 'string' ? override : prompt
    ).trim();
    if (!trimmedPrompt) return;

    // Snapshot history before touching state
    const history = messages; // already has prior user + assistant turns

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedPrompt,
    };
    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      isError: false,
    };

    turnStartIndexRef.current = charts.length;

    // flushSync forces React to commit the new messages to the DOM synchronously
    // before we proceed. Without this, the requestAnimationFrame below would run
    // before the DOM has updated, meaning lastUserMsgRef wouldn't point to the
    // correct element yet and the scroll would be off.
    flushSync(() => {
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setPrompt('');
    });

    // After the DOM has updated, scroll the container so the user's message bubble
    // sits at the top of the viewport. We use requestAnimationFrame to wait one
    // paint cycle, ensuring layout is complete and getBoundingClientRect() returns
    // accurate values before we calculate the scroll offset.
    //
    // This is the SYNCHRONOUS counterpart to the right panel's pin-to-top. We can
    // do it inline here because the anchor (the user message) already exists after
    // the flushSync above. The right panel can't — its charts arrive later over
    // the stream — so it pins reactively in the `charts` useEffect instead.
    requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      const lastUserMessage = lastUserMsgRef.current;

      if (!container || !lastUserMessage) return;

      const containerRect = container.getBoundingClientRect();
      const messageRect = lastUserMessage.getBoundingClientRect();
      const topOffset = messageRect.top - containerRect.top;

      container.scrollTo({
        top: container.scrollTop + topOffset - 24,
        behavior: 'auto',
      });
    });

    function setError(msg) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: msg, isError: true }
            : m,
        ),
      );
    }

    // Build what we send: trimmed history (max 20 messages) + new user message
    const outgoingMessages = [
      ...history.map(({ role, content }) => ({ role, content })).slice(-20),
      { role: 'user', content: trimmedPrompt },
    ];

    // console.log('[researcher] outgoing messages:', outgoingMessages);

    try {
      const res = await fetch(`${API_BASE_URL}/researcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoingMessages, contextType, slug }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      // DEBUG-ONLY: finalText/finalCharts exist solely to feed the debug log at
      // the end of the stream loop. The UI is driven by setMessages/setCharts,
      // not these. Remove these two declarations and their accumulation lines
      // below when the debug console.log is removed.
      let finalText = '';
      const finalCharts = [];
      let lineBuffer = '';
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        done = streamDone;

        // Accumulate into a line buffer so SSE lines split across TCP chunks are
        // reassembled before parsing. Without this, large chart payloads cause
        // JSON.parse failures when the chunk boundary falls mid-line.
        lineBuffer += decoder.decode(value ?? new Uint8Array(), {
          stream: !done,
        });

        const lines = lineBuffer.split('\n');
        // Keep the last (potentially incomplete) segment in the buffer
        lineBuffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') {
            done = true;
            break;
          }

          const { text, error, chart } = JSON.parse(payload);

          if (error) {
            setError(error);
            done = true;
            break;
          }

          if (text) {
            finalText += text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + text }
                  : m,
              ),
            );
          }

          if (chart) {
            finalCharts.push(chart);
            setCharts((prev) => [...prev, chart]);
          }
        }
      }

      // DEBUG-ONLY: remove before production. Removing this also makes finalText
      // and finalCharts (declared above) dead code — delete them together.
      console.log('[researcher] final response:', {
        text: finalText,
        charts: finalCharts,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <>
      <Breadcrumb pages={researchPages} />
      <Heading level={1} className="sr-only">
        Hefti Researcher
      </Heading>

      <div className="bg-core-white grid h-[calc(100vh-140px)] grid-cols-1 lg:grid-cols-2">
        {/**Left-Panel Text and Input */}
        <section className="bg-background-tertiary flex min-h-0 flex-col">
          <div className="ml-auto flex h-full min-h-0 w-full max-w-[640px] flex-col">
            {hasStarted ? (
              <>
                {/**Text Display */}
                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto px-6 py-8"
                >
                  <div className="space-y-5">
                    {messages.map((message, i) => {
                      const isLastUser =
                        message.role === 'user' &&
                        !messages.slice(i + 1).some((m) => m.role === 'user');
                      const isLatestAssistant =
                        message.role === 'assistant' &&
                        i === messages.length - 1;
                      return (
                        <div
                          key={message.id}
                          ref={isLastUser ? lastUserMsgRef : null}
                          style={
                            isLatestAssistant
                              ? { minHeight: `${assistantMinHeight}px` }
                              : undefined
                          }
                          className={
                            message.role === 'user'
                              ? 'bg-background-primary ml-auto max-w-[85%] rounded-3xl rounded-tr-sm px-4 py-3 text-left'
                              : 'text-paragraph-base text-core-black max-w-[92%]'
                          }
                        >
                          {message.role === 'assistant' ? (
                            message.isError ? (
                              <p className="text-paragraph-base text-red-600">
                                {message.content}
                              </p>
                            ) : (
                              <ReactMarkdown components={MdComponents}>
                                {message.content}
                              </ReactMarkdown>
                            )
                          ) : (
                            <p className="text-paragraph-base text-core-black wrap-break-word whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ResearcherComposer
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={submitPrompt}
                />
              </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <Heading level={2} className="text-heading-lg mb-1">
                    Hefti Researcher
                  </Heading>
                  <p className="text-paragraph-base text-content-secondary mb-6">
                    {contextType === 'owner'
                      ? "Ask a question about this owner's facilities, quality, staffing, or financials."
                      : "Ask a question about this facility's quality, staffing, deficiencies, or ownership."}
                  </p>
                  <div className="hidden md:block">
                    <p className="text-paragraph-sm text-content-secondary mb-3 font-medium">
                      Try asking
                    </p>
                    <div className="flex flex-col items-start gap-2">
                      {(contextType === 'owner'
                        ? OWNER_PROMPTS
                        : FACILITY_PROMPTS
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => submitPrompt(p)}
                          className="text-paragraph-sm text-core-black border-border-primary bg-core-white hover:bg-background-tertiar cursor-pointer rounded-lg border px-4 py-3 text-left shadow-sm transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <ResearcherComposer
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={submitPrompt}
                />
              </div>
            )}
          </div>
        </section>

        {/* Right panel — chart output */}
        <section
          aria-label="Generated charts"
          className="bg-background-secondary flex min-h-0 flex-col"
        >
          {/* aria-live announces newly streamed charts to screen readers, since
              they appear without any focus or navigation change. */}
          <div
            ref={chartsPanelRef}
            aria-live="polite"
            className="mr-auto flex h-full w-full max-w-[600px] flex-col space-y-4 overflow-y-auto p-6"
          >
            {!hasStarted && charts.length > 0 && (
              <p className="text-paragraph-sm text-content-secondary pb-2">
                More visualizations will appear here as you explore.
              </p>
            )}
            {charts.map((chart, i) => (
              <React.Fragment key={i}>
                <div
                  ref={
                    i === turnStartIndexRef.current ? turnFirstChartRef : null
                  }
                >
                  <ResearchChart chart={chart} />
                </div>
                {hasStarted && i === contextChartCountRef.current - 1 && (
                  <div className="flex items-center gap-3 py-2">
                    <div
                      aria-hidden="true"
                      className="bg-border-primary h-px flex-1"
                    />
                    <span className="text-paragraph-sm text-content-secondary shrink-0">
                      Session start
                    </span>
                    <div
                      aria-hidden="true"
                      className="bg-border-primary h-px flex-1"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
            {/* Trailing spacer — guarantees enough scroll depth to pin a new
                turn's first chart to the top, mirroring assistantMinHeight on
                the left panel. Sized to the panel's full height so the pin works
                even before Recharts has laid out the incoming chart. */}
            {charts.length > 0 && (
              <div
                aria-hidden="true"
                style={{ minHeight: `${chartsSpacerHeight}px` }}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
