/**
 * Sourced from UI Application/Containers/Full-width on mobile
 * Changed max-w to 1180 per design request
 */

export default function LayoutPage({ children }) {
  return (
    <div className="mx-auto max-w-[1180px] sm:px-6 lg:px-8">{children}</div>
  );
}
