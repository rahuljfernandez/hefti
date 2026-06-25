import React, { useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import ResearcherComposer from '../components/ui/molecule/researcherComposer';
import {
  getResearchPages,
  getRankingsResearchPages,
} from '../lib/breadcrumbPages';
import { Heading } from '../components/ui/atom/heading';
import ResearchChart, {
  chartToRows,
} from '../components/ui/molecule/ResearchChart';
import ChatMessage from '../components/ui/molecule/ChatMessage';
import ResearchEmptyState from '../components/ui/molecule/ResearchEmptyState';
import ExportSessionWidget from '../components/ui/molecule/ExportSessionWidget';
import SessionStartDivider from '../components/ui/molecule/SessionStartDivider';
import DimOverlay from '../lib/shareability/ResearchPanelDimOverlay';
import { getPanelAccent } from '../lib/shareability/researchPanelAccent';
import { createResearchShareActions } from '../lib/shareability/researchShareActions';
import useResearchScroll from '../hooks/useResearchScroll';
import useResearchContextCharts from '../hooks/useResearchContextCharts';
import useResearchStream from '../hooks/useResearchStream';

/**
 * HeftiResearch
 *
 * AI-powered researcher chat page for exploring facility and owner data.
 * Accessible via the CTA on Owner and Facility profile pages.
 *
 * - Derives `contextType` ("owner" | "facility") from the current URL path
 *   so the backend can scope its response to the right entity type.
 * - Streams assistant responses and folds them into message/chart state via
 *   useResearchStream; seeds the on-load context chart via useContextCharts;
 *   and pins each new turn to the top of both panels via useResearchScroll.
 *
 * This component owns the core message/chart state and the render; the three
 * hooks above own the streaming, seeding, and scroll choreography respectively.
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
  const chartsRef = useRef([]);
  chartsRef.current = charts;
  /* Which panel(s) the ShareWidget's hovered segment targets ('left' |
     'right' | 'both' | null) — drives the highlight/dim accent on the two
     panels below. */
  const [hoveredTarget, setHoveredTarget] = useState(null);
  /* message.id -> rendered markdown DOM node, used to read rendered HTML for
     "copy as rich text" without keeping a ref per message via useRef. */
  const assistantContentRefs = useRef(new Map());
  /* chart index -> rendered card DOM node, used to capture each chart as its
     own PNG for the "Right panel" export (see handleExportRightPanel). */
  const chartCardRefs = useRef(new Map());
  const hasStarted = messages.length > 0;

  const {
    messagesContainerRef,
    lastUserMsgRef,
    chartsPanelRef,
    turnFirstChartRef,
    turnStartIndexRef,
    assistantMinHeight,
    chartsSpacerHeight,
    pinUserMessageToTop,
  } = useResearchScroll({ charts, hasStarted });

  const { subjectName, contextChartCountRef, chartCountRef } =
    useResearchContextCharts({
      slug,
      contextType,
      setCharts,
    });

  const { isStreaming, submitPrompt } = useResearchStream({
    contextType,
    slug,
    prompt,
    setPrompt,
    messages,
    setMessages,
    charts,
    setCharts,
    chartsRef,
    chartCountRef,
    turnStartIndexRef,
    pinUserMessageToTop,
  });

  const {
    handleExportRightPanel,
    handleCopyLeftPanel,
    handleExportFullSession,
  } = createResearchShareActions({
    assistantContentRefs,
    chartCardRefs,
    chartsRef,
    chartToRows,
    contextChartCountRef,
    messages,
    subjectName,
  });

  /* Drives the ShareWidget hover accent: the targeted panel(s) get a blue
     highlight ring, the other panel gets dimmed by an overlay. */
  const { leftHighlighted, rightHighlighted, leftDimmed, rightDimmed } =
    getPanelAccent(hoveredTarget);

  return (
    <>
      <Breadcrumb pages={researchPages} />
      <Heading level={1} className="sr-only">
        Hefti Researcher
      </Heading>

      <div className="bg-core-white grid h-[calc(100vh-140px)] grid-cols-1 lg:grid-cols-2">
        {/**Left-Panel Text and Input */}
        <section
          className={clsx(
            'bg-background-tertiary relative flex min-h-0 flex-col transition-shadow',
            leftHighlighted && 'ring-2 ring-blue-600 ring-inset',
          )}
        >
          {leftDimmed && <DimOverlay />}
          <div className="ml-auto flex h-full min-h-0 w-full max-w-[640px] flex-col">
            {hasStarted ? (
              <>
                {/**Text Display */}
                <div
                  ref={messagesContainerRef}
                  className="min-h-0 flex-1 overflow-y-auto px-6 py-8"
                >
                  <div className="space-y-2">
                    {messages.map((message, i) => {
                      const isLastUser =
                        message.role === 'user' &&
                        !messages.slice(i + 1).some((m) => m.role === 'user');
                      const isLatestAssistant =
                        message.role === 'assistant' &&
                        i === messages.length - 1;
                      const showShareRow =
                        message.role === 'assistant' &&
                        !message.isError &&
                        !(isLatestAssistant && isStreaming) &&
                        message.content.trim().length > 0;
                      return (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          isLastUser={isLastUser}
                          isLatestAssistant={isLatestAssistant}
                          showShareRow={showShareRow}
                          assistantMinHeight={assistantMinHeight}
                          lastUserMsgRef={lastUserMsgRef}
                          assistantContentRefs={assistantContentRefs}
                        />
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
                <ResearchEmptyState
                  contextType={contextType}
                  onSelectPrompt={submitPrompt}
                />
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
          className={clsx(
            'bg-background-secondary relative flex min-h-0 flex-col transition-shadow',
            rightHighlighted && 'ring-2 ring-blue-600 ring-inset',
          )}
        >
          {rightDimmed && <DimOverlay />}
          {hasStarted && (
            <ExportSessionWidget
              onCategoryHover={setHoveredTarget}
              onCopyLeftPanel={handleCopyLeftPanel}
              onExportFullSession={handleExportFullSession}
              onExportRightPanel={handleExportRightPanel}
            />
          )}
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
                  <ResearchChart
                    chart={chart}
                    isLatest={i === charts.length - 1}
                    onCardMount={(el) => {
                      if (el) {
                        chartCardRefs.current.set(i, el);
                      } else {
                        chartCardRefs.current.delete(i);
                      }
                    }}
                  />
                </div>
                {hasStarted && i === contextChartCountRef.current - 1 && (
                  <SessionStartDivider />
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
