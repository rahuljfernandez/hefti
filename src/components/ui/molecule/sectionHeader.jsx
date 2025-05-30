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

//To include the description, a desription prop must be passed in.
export default function SectionHeader({
  title,
  description,
  variant = '',
  titleClassName = '',
  descriptionClassName = '',
  containerClassName = '',
}) {
  const styles = variants[variant];
  console.log(styles);
  console.log(styles.container);
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
