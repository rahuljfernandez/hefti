/**
 * Sourced from UI Application/Cards/Basic card,
 */

export default function LayoutCard({ children }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
