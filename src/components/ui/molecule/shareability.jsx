import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Tooltip from '../atom/tooltip';

const CLICK_FEEDBACK_MS = 1200;
const AUTO_COLLAPSE_MS = 2200;

/* Animating `width` to/from the string 'auto' makes Framer Motion measure
   the element's layout mid-animation, which is the source of a well-known
   stutter partway through the transition. Measuring the content's actual
   pixel width once up front and animating to/from that number instead
   avoids the runtime auto-measurement entirely, so the transition is
   driven purely by numbers with no layout reads competing with it. Each
   segment grows/shrinks its own width rather than the whole bar fading as
   one block — reads as the bar telescoping segments out of, and back into,
   the persistent icon anchored at its right edge. */
function GrowShrink({ className, children, skipEnter }) {
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, []);

  /* Runs after paint, one render behind the layout effect above — lets the
     very first width measurement (0 -> measured) render with skipFirstGrow
     still true, before flipping settled for any later transitions. */
  useEffect(() => {
    if (contentWidth > 0) setSettled(true);
  }, [contentWidth]);

  const skipFirstGrow = skipEnter && !settled;

  return (
    <motion.div
      initial={skipEnter ? false : { width: 0, opacity: 0 }}
      animate={{
        width: contentWidth,
        opacity: 1,
        transition: { duration: skipFirstGrow ? 0 : 0.2 },
      }}
      /* pointerEvents isn't interpolated — Framer Motion applies it
         immediately when exit starts, so a shrinking segment can't fire
         hover/click while it's still visible mid-animation. */
      exit={{
        width: 0,
        opacity: 0,
        pointerEvents: 'none',
        transition: { duration: 0.6 },
      }}
      className="overflow-x-clip"
    >
      <div ref={contentRef} className={clsx('whitespace-nowrap', className)}>
        {children}
      </div>
    </motion.div>
  );
}

GrowShrink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  skipEnter: PropTypes.bool,
};

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
 * import { copyText, downloadCsv } from '../../../lib/shareability/shareActions';
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
    } catch {
      /* shareActions functions already resolve to false on failure rather
         than throwing — this only guards against an unexpected rejection
         becoming an unhandled promise rejection. */
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
  emptyLabel,
  onClick,
  onHoverChange,
}) {
  const [status, setStatus] = useState('idle');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function handleClick() {
    if (status !== 'idle') return;
    setStatus('loading');
    try {
      const result = await onClick();
      const next = result ? 'success' : emptyLabel ? 'empty' : 'idle';
      setStatus(next);
      if (next !== 'idle') {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setStatus('idle'), CLICK_FEEDBACK_MS);
      }
    } catch {
      setStatus('idle');
    }
  }

  const display = {
    idle: { icon: Icon, text: label },
    loading: { icon: ArrowPathIcon, text: loadingLabel ?? label },
    success: { icon: CheckIcon, text: successLabel ?? label },
    empty: { icon: ExclamationCircleIcon, text: emptyLabel ?? label },
  }[status];

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        className="text-paragraph-sm text-core-white inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 whitespace-nowrap transition-colors hover:bg-white/10"
      >
        <display.icon
          className={clsx('size-4', status === 'loading' && 'animate-spin')}
          aria-hidden="true"
        />
        <span>{display.text}</span>
      </button>
    </div>
  );
}

TelescopeSegment.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string,
  successLabel: PropTypes.string,
  emptyLabel: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onHoverChange: PropTypes.func,
};

/**
 * ShareWidget — the full-scale telescoping theme. A persistent icon button
 * anchors the right edge; clicking it grows one TelescopeSegment per
 * category (1-3) out to its left, each animating its own width in/out
 * (rather than the whole bar fading as one block).
 *
 * When `title` is set, the widget mounts already expanded with that title
 * grown in as a non-interactive leading label (a "display category") and
 * the categories hidden, then auto-collapses on its own — a one-time
 * introduction so a first-time viewer sees what the icon means before it
 * withdraws back into the icon.
 *
 * @example
 * <ShareWidget
 *   title="Export Session"
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
  title,
  minimizedIcon: MinimizedIcon = ArrowDownTrayIcon,
  minimizedLabel = 'Export',
  onCategoryHover,
}) {
  const [isExpanded, setIsExpanded] = useState(Boolean(title));
  const [isIntro, setIsIntro] = useState(Boolean(title));
  const autoCollapseRef = useRef(null);
  const clearCategoryHover = useCallback(() => {
    onCategoryHover?.(null);
  }, [onCategoryHover]);

  useEffect(() => {
    if (!title) return;
    autoCollapseRef.current = setTimeout(() => {
      setIsExpanded(false);
      setIsIntro(false);
      clearCategoryHover();
    }, AUTO_COLLAPSE_MS);
    return () => clearTimeout(autoCollapseRef.current);
  }, [title, clearCategoryHover]);

  useEffect(() => {
    if (!isExpanded) clearCategoryHover();
  }, [isExpanded, clearCategoryHover]);

  useEffect(() => {
    return clearCategoryHover;
  }, [clearCategoryHover]);

  function handleToggle(next) {
    clearTimeout(autoCollapseRef.current);
    setIsIntro(false);
    setIsExpanded(next);
    /* Collapsing unmounts the hovered segment without a mouseleave event,
       which would otherwise leave its highlight stuck on. */
    if (!next) clearCategoryHover();
  }

  return (
    <div
      className="text-core-white flex items-center divide-x divide-white/20 rounded-md bg-blue-600 shadow-md"
      onMouseLeave={clearCategoryHover}
    >
      <AnimatePresence initial={false}>
        {isExpanded && isIntro && (
          <GrowShrink
            key="title"
            skipEnter
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
          >
            <MinimizedIcon className="size-4" aria-hidden="true" />
            {title}
          </GrowShrink>
        )}
        {isExpanded &&
          !isIntro &&
          categories.map((category) => (
            <div key={category.label} className="group relative">
              <GrowShrink>
                <TelescopeSegment
                  {...category}
                  onHoverChange={(isHovering) =>
                    onCategoryHover?.(isHovering ? category.target : null)
                  }
                />
              </GrowShrink>
              {category.tooltip && (
                <Tooltip size="sm" className="max-w-56 shadow-sm">
                  {category.tooltip}
                </Tooltip>
              )}
            </div>
          ))}
      </AnimatePresence>
      <div className="group relative flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => handleToggle(!isExpanded)}
          aria-label={isExpanded ? 'Close' : minimizedLabel}
          className="inline-flex cursor-pointer items-center justify-center p-2.5 transition-colors hover:bg-white/10"
        >
          {isExpanded ? (
            <XMarkIcon className="size-5" aria-hidden="true" />
          ) : (
            <MinimizedIcon className="size-5" aria-hidden="true" />
          )}
        </button>
        {!isExpanded && (
          <Tooltip>
            {minimizedLabel}
          </Tooltip>
        )}
      </div>
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
      emptyLabel: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      /* Opaque identifier forwarded as-is to onCategoryHover — ShareWidget
         doesn't interpret it, the caller defines what it means. */
      target: PropTypes.string,
    }),
  ).isRequired,
  title: PropTypes.string,
  minimizedIcon: PropTypes.elementType,
  minimizedLabel: PropTypes.string,
  onCategoryHover: PropTypes.func,
};
