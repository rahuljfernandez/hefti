function SkeletonBar({ className = '' }) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  );
}

export function IndustryListSkeleton() {
  return (
    <ul className="divide-y divide-gray-200 rounded-xl border border-l-2 border-gray-200 bg-white/80">
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between px-6 py-6">
          <SkeletonBar className="h-4 w-40" />
          <SkeletonBar className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}
