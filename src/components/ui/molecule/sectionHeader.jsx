const variants = {
  default: {
    container: 'pb-5 ',
    title: 'text-base font-semibold text-gray-900',
    description: 'mt-2 max-w-4xl text-sm text-gray-500',
  },
  primary: {
    container: '',
    title: 'text-heading-sm',
    description: 'mt-2 max-w-4xl text-paragraph-sm',
  },
};

/**
 * Component provides heading styles that will be used multiple times in many pages.
 * There are two prevalent layouts: 1) Just the title 2) Tilte plus description. 
 * Two styling props are included in case customization is needed.
 * 
 * Example:
 *   <SectionHeader
        title="hello"
        variant="primary"
        description={'Welcome to the hefti project.'}
      />
 */

export default function SectionHeader({
  title,
  description,
  variant = 'primary',
  titleClassName = '',
  descriptionClassName = '',
  containerClassName = '',
}) {
  const styles = variants[variant];

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      <h3 className={`${styles.title} ${titleClassName}`}>{title}</h3>
      {description && (
        <p className={`${styles.description} ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}
