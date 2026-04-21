function SkeletonBar({ className = '' }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export function BrowseListSkeleton({ count = 10 }) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="bg-core-white border-border-primary mb-3 overflow-hidden rounded-xl border px-4 py-4 shadow-sm sm:px-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <SkeletonBar className="h-5 w-3/4" />
              <SkeletonBar className="h-4 w-1/2" />
              <SkeletonBar className="h-4 w-2/5" />
            </div>
            <div className="space-y-2">
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-4 w-3/4" />
            </div>
          </div>
        </li>
      ))}
    </ul>
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
