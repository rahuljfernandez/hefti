import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ClipboardDocumentIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { ShareWidget } from './shareability';
import { SHARE_WIDGET_Z_CLASS } from '../../../lib/shareability/researchPanelAccent';

/**
 * The right panel's "Export Session" telescoping widget, positioned absolutely
 * over the top of the charts panel. Wires the three export handlers into the
 * ShareWidget's category config; hover targeting is forwarded via
 * `onCategoryHover` so the page can drive the panel highlight/dim accent.
 */
export default function ResearchExportWidget({
  onCategoryHover,
  onCopyLeftPanel,
  onExportFullSession,
  onExportRightPanel,
}) {
  return (
    <div
      className={clsx(
        'absolute inset-x-0 top-4 mr-auto flex w-full max-w-[600px] justify-end px-6',
        SHARE_WIDGET_Z_CLASS,
      )}
    >
      <ShareWidget
        title="Export Session"
        onCategoryHover={onCategoryHover}
        categories={[
          {
            icon: ClipboardDocumentIcon,
            label: 'Left panel',
            tooltip: 'Copy all chat text',
            loadingLabel: 'Copying…',
            successLabel: 'Copied',
            onClick: onCopyLeftPanel,
            target: 'left',
          },
          {
            icon: DocumentArrowDownIcon,
            label: 'Full session (PDF)',
            tooltip: 'Export the full session as a PDF',
            loadingLabel: 'Exporting…',
            successLabel: 'Downloaded',
            onClick: onExportFullSession,
            target: 'both',
          },
          {
            icon: ChartBarIcon,
            label: 'Right panel',
            tooltip: 'Download charts + data',
            loadingLabel: 'Exporting…',
            successLabel: 'Downloaded',
            emptyLabel: 'No charts yet',
            onClick: onExportRightPanel,
            target: 'right',
          },
        ]}
      />
    </div>
  );
}

ResearchExportWidget.propTypes = {
  onCategoryHover: PropTypes.func,
  onCopyLeftPanel: PropTypes.func.isRequired,
  onExportFullSession: PropTypes.func.isRequired,
  onExportRightPanel: PropTypes.func.isRequired,
};
