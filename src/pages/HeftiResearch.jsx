import React, { useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/ui/molecule/breadcrumb';
import {
  getResearchPages,
  getRankingsResearchPages,
} from '../lib/breadcrumbPages';
import { Heading } from '../components/ui/atom/heading';
import { chartToRows } from '../components/ui/molecule/ResearchChart';
import ResearchChatPanel from '../components/ui/organism/ResearchChatPanel';
import ResearchChartsPanel from '../components/ui/organism/ResearchChartsPanel';
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
        <ResearchChatPanel
          highlighted={leftHighlighted}
          dimmed={leftDimmed}
          hasStarted={hasStarted}
          messages={messages}
          isStreaming={isStreaming}
          contextType={contextType}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmitPrompt={submitPrompt}
          assistantMinHeight={assistantMinHeight}
          messagesContainerRef={messagesContainerRef}
          lastUserMsgRef={lastUserMsgRef}
          assistantContentRefs={assistantContentRefs}
        />

        <ResearchChartsPanel
          highlighted={rightHighlighted}
          dimmed={rightDimmed}
          hasStarted={hasStarted}
          charts={charts}
          chartsPanelRef={chartsPanelRef}
          chartsSpacerHeight={chartsSpacerHeight}
          turnStartIndexRef={turnStartIndexRef}
          turnFirstChartRef={turnFirstChartRef}
          chartCardRefs={chartCardRefs}
          contextChartCountRef={contextChartCountRef}
          onCategoryHover={setHoveredTarget}
          onCopyLeftPanel={handleCopyLeftPanel}
          onExportFullSession={handleExportFullSession}
          onExportRightPanel={handleExportRightPanel}
        />
      </div>
    </>
  );
}
