// Skeleton component for loading state of orders page
export function OrdersPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-black pt-24 pb-16"
      aria-busy="true"
      aria-label="Loading orders"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 w-64 bg-zinc-800 rounded-lg animate-pulse mb-3"></div>
          <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse"></div>
        </div>

        {/* Orders Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 flex gap-3">
                <div className="h-12 w-36 bg-zinc-800 rounded-lg animate-pulse"></div>
                <div className="h-12 w-36 bg-zinc-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
