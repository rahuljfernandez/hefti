import clsx from 'clsx';

export function Heading({ className, level = 1, ...props }) {
  let Element = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(className, 'text-core-black dark:text-core-white')}
    />
  );
}

export function Subheading({ className, level = 2, ...props }) {
  let Element = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white',
      )}
    />
  );
}
