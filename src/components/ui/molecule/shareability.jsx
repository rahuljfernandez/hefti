import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CheckIcon } from '@heroicons/react/24/outline';

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
      disabled={isPending}
      className={clsx(
        'border-border-primary text-content-secondary hover:bg-background-tertiary text-paragraph-xs hover:border-border-inverse-primary hover:text-border-inverse-primary inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 transition-colors hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
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
