import React from 'react';
import clsx from 'clsx';

/**
 * Default TW  Component sourced from Catalyst UI Kit
 */
export function Divider({ soft = false, className, ...props }) {
  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        'w-full border-t',
        soft && 'border-zinc-950/5 dark:border-white/5',
        !soft && 'border-zinc-950/10 dark:border-white/10',
      )}
    />
  );
}
