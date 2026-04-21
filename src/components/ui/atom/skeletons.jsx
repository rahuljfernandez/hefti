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

export function ProfilePageSkeleton() {
  return (
    <div className="animate-pulse font-sans">
      {/* ProfileHeader */}
      <div className="my-6 flex flex-wrap justify-between">
        <div>
          <SkeletonBar className="h-9 w-80" />
          <div className="mt-4">
            <SkeletonBar className="h-6 w-32 rounded-full" />
          </div>
          <SkeletonBar className="mt-4 h-4 w-48" />
        </div>
        <SkeletonBar className="h-10 w-36 rounded-lg" />
      </div>
      {/* Tab nav */}
      <div className="mt-6 flex gap-4 border-b border-gray-200 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} className="h-5 w-28" />
        ))}
      </div>
      {/* Tab content area */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <SkeletonBar className="h-4 w-1/2" />
              <SkeletonBar className="h-8 w-1/3" />
              <SkeletonBar className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <SkeletonBar className="h-4 w-1/4" />
          <SkeletonBar className="h-4 w-full" />
          <SkeletonBar className="h-4 w-5/6" />
        </div>
      </div>
    </div>
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
