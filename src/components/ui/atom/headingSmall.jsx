import { Heading } from './heading';

export default function HeadingSmall({ title }) {
  return (
    <div className="text-heading-sm my-8">
      <Heading level={3}>{title}</Heading>
    </div>
  );
}
