export default function CatalogLoading() {
  return (
    <div className="min-h-screen pt-[104px] animate-pulse">
      {/* Header skeleton */}
      <div className="px-6 max-w-7xl mx-auto py-10">
        <div className="h-3 w-24 bg-border-light rounded mb-3" />
        <div className="h-10 w-48 bg-border-light rounded" />
      </div>

      <div className="border-b border-border-light" />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-24 bg-border-light rounded-full" />
          <div className="ml-auto h-9 w-32 bg-border-light rounded-full" />
        </div>
        <div className="h-3 w-20 bg-border-light rounded mb-6" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border-light overflow-hidden bg-white">
              <div className="aspect-[3/4] bg-surface-2" />
              <div className="p-4 space-y-2">
                <div className="h-2.5 w-16 bg-border-light rounded" />
                <div className="h-4 w-3/4 bg-border-light rounded" />
                <div className="flex gap-1.5 pt-1">
                  <div className="h-7 w-14 bg-border-light rounded-full" />
                  <div className="h-7 w-14 bg-border-light rounded-full" />
                </div>
                <div className="h-4 w-20 bg-border-light rounded" />
                <div className="h-9 w-full bg-border-light rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
