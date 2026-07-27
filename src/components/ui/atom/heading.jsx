import clsx from 'clsx';

/**
 * Heading component with Tailwind font size mapping:
 * 1: text-4xl font-bold
 * 2: text-3xl font-semibold
 * 3: text-2xl font-semibold
 * 4: text-xl font-semibold
 * 5: text-lg font-semibold
 * 6: text-base font-semibold
 */
export function Heading({ className, level = 1, ...props }) {
  let Element = `h${level}`;
  const sizeMap = {
    1: 'text-5xl font-bold',
    2: 'text-4xl font-semibold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold',
  };
  /* clsx doesn't merge conflicting Tailwind utilities, so let a semantic type
     token in className replace the level default rather than fight it. */
  const hasTypeToken = /\btext-(display|heading|label|paragraph)-/.test(
    className ?? '',
  );
  return (
    <Element
      {...props}
      className={clsx(
        !hasTypeToken && sizeMap[level],
        className,
        'text-core-black',
      )}
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
        'text-base/7 font-semibold text-zinc-950 sm:text-sm/6',
      )}
    />
  );
}
