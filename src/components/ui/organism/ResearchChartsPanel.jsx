import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ResearchChart from '../molecule/ResearchChart';
import ExportSessionWidget from '../molecule/ExportSessionWidget';
import SessionStartDivider from '../molecule/SessionStartDivider';
import DimOverlay from '../../../lib/shareability/ResearchPanelDimOverlay';

/**
 * Right researcher panel: the streamed chart output. Hosts the "Export Session"
 * widget (once a turn has started), the on-load context charts and the
 * session-start divider that separates them from AI-generated charts, and a
 * trailing spacer sized by useResearchScroll so a new turn's first chart can
 * pin to the top. Shows the highlight/dim accent when targeted by the widget.
 */
export default function ResearchChartsPanel({
  highlighted,
  dimmed,
  hasStarted,
  charts,
  chartsPanelRef,
  chartsSpacerHeight,
  turnStartIndexRef,
  turnFirstChartRef,
  chartCardRefs,
  contextChartCountRef,
  onCategoryHover,
  onCopyLeftPanel,
  onExportFullSession,
  onExportRightPanel,
}) {
  return (
    <section
      aria-label="Generated charts"
      className={clsx(
        'bg-background-secondary relative flex min-h-0 flex-col transition-shadow',
        highlighted && 'ring-2 ring-blue-600 ring-inset',
      )}
    >
      {dimmed && <DimOverlay />}
      {hasStarted && (
        <ExportSessionWidget
          onCategoryHover={onCategoryHover}
          onCopyLeftPanel={onCopyLeftPanel}
          onExportFullSession={onExportFullSession}
          onExportRightPanel={onExportRightPanel}
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
            <div ref={i === turnStartIndexRef.current ? turnFirstChartRef : null}>
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
  );
}

ResearchChartsPanel.propTypes = {
  highlighted: PropTypes.bool,
  dimmed: PropTypes.bool,
  hasStarted: PropTypes.bool,
  charts: PropTypes.arrayOf(PropTypes.object).isRequired,
  chartsPanelRef: PropTypes.shape({ current: PropTypes.any }),
  chartsSpacerHeight: PropTypes.number,
  turnStartIndexRef: PropTypes.shape({ current: PropTypes.any }),
  turnFirstChartRef: PropTypes.shape({ current: PropTypes.any }),
  chartCardRefs: PropTypes.shape({ current: PropTypes.instanceOf(Map) }),
  contextChartCountRef: PropTypes.shape({ current: PropTypes.number }),
  onCategoryHover: PropTypes.func,
  onCopyLeftPanel: PropTypes.func.isRequired,
  onExportFullSession: PropTypes.func.isRequired,
  onExportRightPanel: PropTypes.func.isRequired,
};
