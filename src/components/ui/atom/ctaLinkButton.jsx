import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

/* Solid dark button styled call-to-action. An external `to` (http(s):// or //)
   renders an <a> that opens in a new tab; anything else renders an in-app router
   Link. `icon` adds a trailing glyph, `fullWidth` fills the container. */

const isExternalUrl = (to) => /^(https?:)?\/\//.test(to);

export default function CtaLinkButton({
  to,
  children,
  icon: Icon,
  fullWidth = false,
  className,
}) {
  const classes = clsx(
    'focus-ring-light inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800',
    Icon && 'gap-2',
    fullWidth ? 'w-full' : 'shrink-0',
    className,
  );

  const content = (
    <>
      {children}
      {Icon && <Icon className="size-5" aria-hidden="true" />}
    </>
  );

  if (isExternalUrl(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {content}
    </Link>
  );
}

CtaLinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};
