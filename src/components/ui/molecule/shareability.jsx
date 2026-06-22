import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  CheckIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const CLICK_FEEDBACK_MS = 1200;

/**
 * shareability
 *
 * Hosts the lightweight ShareButton theme used inline in chat messages and
 * chart cards. A full-scale "telescoping" widget (accepting multiple share
 * categories and expanding/collapsing between them) will be added here
 * later — this file is the single home for all shareability UI.
 *
 * @example
 * import { ShareButton, ShareButtonRow } from './shareability';
 * import { copyText, downloadCsv } from '../../../lib/shareActions';
 * import { DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';
 *
 * <ShareButtonRow>
 *   <ShareButton
 *     icon={DocumentTextIcon}
 *     label="Copy text"
 *     onClick={() => copyText(message.content)}
 *   />
 *   <ShareButton
 *     icon={TableCellsIcon}
 *     label="Download data as CSV"
 *     onClick={() => downloadCsv(rows, 'chart.csv', headers)}
 *     className="ml-2"
 *   />
 * </ShareButtonRow>
 */
export function ShareButton({ icon: Icon, label, onClick, className }) {
  const [justSucceeded, setJustSucceeded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function handleClick() {
    /* Guards against a rapid double-click firing onClick twice concurrently
       (e.g. two overlapping PNG renders/downloads from the same button). */
    if (isPending) return;
    setIsPending(true);
    try {
      const result = await onClick();
      if (result) {
        setJustSucceeded(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => setJustSucceeded(false),
          CLICK_FEEDBACK_MS,
        );
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'border-border-primary text-content-secondary hover:bg-background-tertiary text-paragraph-xs hover:border-border-inverse-primary hover:text-border-inverse-primary inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 transition-colors hover:shadow-sm',
        className,
      )}
    >
      {justSucceeded ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <Icon className="size-4" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
}

ShareButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export function ShareButtonRow({ children }) {
  return <div className="flex items-center gap-2">{children}</div>;
}

ShareButtonRow.propTypes = {
  children: PropTypes.node,
};

/**
 * Wraps a ShareButtonRow so it's always visible when `show` is true (e.g. the
 * latest chat message or chart), and otherwise hidden until the nearest
 * ancestor with className="group" is hovered. Centralizes the opacity/hover
 * treatment so chat messages and chart cards don't each hand-roll their own
 * copy of the same `clsx` expression.
 */
export function HoverReveal({ show, className, children }) {
  return (
    <div
      className={clsx(
        'transition-opacity',
        show ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  );
}

HoverReveal.propTypes = {
  show: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

/* One segment inside an expanded ShareWidget. Unlike ShareButton, the
   in-flight state is visible (spinner + custom text) rather than a silent
   guard, since the widget's segments need to show real export/copy progress. */
function TelescopeSegment({
  icon: Icon,
  label,
  tooltip,
  loadingLabel,
  successLabel,
  onClick,
}) {
  const [status, setStatus] = useState('idle');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function handleClick() {
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const result = await onClick();
      if (result) {
        setStatus('success');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setStatus('idle'), CLICK_FEEDBACK_MS);
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  }

  const display = {
    idle: { icon: Icon, text: label },
    loading: { icon: ArrowPathIcon, text: loadingLabel ?? label },
    success: { icon: CheckIcon, text: successLabel ?? label },
  }[status];

  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
      >
        <display.icon
          className={clsx('size-4', status === 'loading' && 'animate-spin')}
          aria-hidden="true"
        />
        <span>{display.text}</span>
      </button>
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-56 -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100">
          {tooltip}
        </div>
      )}
    </div>
  );
}

TelescopeSegment.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  loadingLabel: PropTypes.string,
  successLabel: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

/**
 * ShareWidget — the full-scale telescoping theme. Minimized to a single icon
 * button; clicking it expands into a horizontal bar with one TelescopeSegment
 * per category (1-3) and a trailing close button that collapses it back.
 *
 * @example
 * <ShareWidget
 *   categories={[
 *     {
 *       icon: TableCellsIcon,
 *       label: 'Right panel',
 *       tooltip: 'Download charts + data',
 *       loadingLabel: 'Exporting…',
 *       successLabel: 'Downloaded',
 *       onClick: () => downloadCsv(rows, 'charts.csv'),
 *     },
 *   ]}
 * />
 */
export function ShareWidget({
  categories,
  minimizedIcon: MinimizedIcon = ArrowDownTrayIcon,
  minimizedLabel = 'Share',
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="group relative flex items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-label={minimizedLabel}
          className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-2.5 text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <MinimizedIcon className="size-5" aria-hidden="true" />
        </button>
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max -translate-x-1/2 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100">
          {minimizedLabel}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center divide-x divide-white/20 rounded-full bg-blue-600 text-white shadow-lg">
      {categories.map((category) => (
        <TelescopeSegment key={category.label} {...category} />
      ))}
      <button
        type="button"
        onClick={() => setIsExpanded(false)}
        aria-label="Close"
        className="inline-flex cursor-pointer items-center px-3 py-2 transition-colors hover:bg-white/10"
      >
        <XMarkIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

ShareWidget.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      tooltip: PropTypes.string,
      loadingLabel: PropTypes.string,
      successLabel: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
  minimizedIcon: PropTypes.elementType,
  minimizedLabel: PropTypes.string,
};
