import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Scroll + layout choreography for the two researcher panels.
 *
 * Both panels pin the newest content to the top of their viewport so each turn
 * starts from the top, but they do it differently because of *when* their
 * anchor element exists:
 *
 * - Left (chat): the anchor is the user's message, which exists the instant they
 *   hit send. So we pin it SYNCHRONOUSLY via `pinUserMessageToTop`, which the
 *   stream hook calls right after it flushes the new message to the DOM. Room to
 *   scroll is made by giving the latest assistant bubble a min-height
 *   (`assistantMinHeight`) equal to ~one viewport.
 * - Right (charts): the anchor is the turn's first chart, which does NOT exist at
 *   send time — charts stream in asynchronously. So we pin REACTIVELY in the
 *   effect keyed on `charts`, scrolling once that first chart arrives. Room to
 *   scroll is made by a trailing spacer (`chartsSpacerHeight`) sized to the
 *   panel's full height, which also survives the brief window before Recharts
 *   has measured the incoming chart.
 *
 * Owns:
 * - the panel/anchor DOM refs (messages container, last user message, charts
 *   panel, the turn's first chart)
 * - `turnStartIndexRef`: the index the current turn's first chart will occupy,
 *   snapshotted by the stream hook at submit and read by the reactive pin below
 * - the measured spacer heights and their ResizeObservers
 */
export default function useResearchScroll({ charts, hasStarted }) {
  const messagesContainerRef = useRef(null);
  const lastUserMsgRef = useRef(null);
  const chartsPanelRef = useRef(null);
  /* Mirrors lastUserMsgRef on the left: the first chart produced by the current
     turn, which we pin to the top of the panel once it arrives. */
  const turnFirstChartRef = useRef(null);
  /* The index the current turn's first chart will occupy, snapshotted at submit
     (before any new charts have streamed in) by the stream hook. */
  const turnStartIndexRef = useRef(null);

  const [assistantMinHeight, setAssistantMinHeight] = useState(0);
  const [chartsSpacerHeight, setChartsSpacerHeight] = useState(0);

  /* Left side (chat): tracks the height of the scroll container so we can give the
     incoming assistant message bubble enough min-height to fill the remaining
     viewport. This ensures there's always enough scroll depth to push the user
     message to the top of the view when a new message is sent, even before the
     assistant has streamed any content. (The right panel's equivalent spacer
     measurement is the next effect below.) */
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

  /* Right-panel equivalent of the spacer measurement above. We track the chart
     panel's own full height (it's taller than the left container, which excludes
     the composer) and use it as a trailing spacer. Sizing the spacer to a full
     viewport guarantees there's enough scroll depth to pin a new turn's first
     chart to the top even during the brief window before Recharts has measured
     and laid out the chart (when it still reports near-zero height). */
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

  /* Right-panel counterpart to the left side's synchronous pin. Unlike the left
     — which pins at send time because the user message already exists — charts
     stream in asynchronously, so we must pin REACTIVELY here: this effect fires
     when `charts` changes and acts only when the turn's first chart has just
     arrived (length === startIdx + 1), scrolling it to the top. The trailing
     spacer in the render guarantees enough scroll depth below it, exactly how
     assistantMinHeight makes room on the left. */
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

  /* Synchronous left-panel pin, called by the stream hook right after it flushes
     the new user message to the DOM. We use requestAnimationFrame to wait one
     paint cycle so layout is complete and getBoundingClientRect() returns
     accurate values before we calculate the scroll offset. This is the
     SYNCHRONOUS counterpart to the right panel's reactive pin above — we can do
     it here because the anchor (the user message) already exists by call time. */
  const pinUserMessageToTop = useCallback(() => {
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
  }, []);

  return {
    messagesContainerRef,
    lastUserMsgRef,
    chartsPanelRef,
    turnFirstChartRef,
    turnStartIndexRef,
    assistantMinHeight,
    chartsSpacerHeight,
    pinUserMessageToTop,
  };
}
