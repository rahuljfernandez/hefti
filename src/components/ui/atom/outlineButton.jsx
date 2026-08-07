import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Outline pill button — the bordered, rounded action used across the app, such
 * as "View Profile" on the browse cards and "AI Summary" on report rows.
 *
 * Polymorphic via `as`: defaults to a real <button>, but pass as="span" when the
 * control sits inside a parent <Link> and should read as inert text styled like
 * a button (the browse-card pattern, where the whole card is the link).
 *
 * `icon` renders a leading glyph; `iconClassName` colors it. `fullWidth` applies
 * the browse-card width behavior (full on mobile, auto on desktop); omit it for a
 * content-width button.
 */
export default function OutlineButton({
  as: Component = 'button',
  icon: Icon,
  iconClassName,
  fullWidth = false,
  children,
  className,
  ...props
}) {
  const isButton = Component === 'button';
  return (
    <Component
      className={clsx(
        'text-label-base border-border-primary inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-center font-extrabold',
        fullWidth && 'w-full md:w-auto',
        isButton && 'focus-ring-light cursor-pointer',
        className,
      )}
      {...(isButton ? { type: 'button' } : {})}
      {...props}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={clsx('size-4 shrink-0', iconClassName)}
        />
      )}
      {children}
    </Component>
  );
}

OutlineButton.propTypes = {
  as: PropTypes.elementType,
  icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};
