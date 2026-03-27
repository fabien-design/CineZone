export function HeroBannerSkeleton() {
  return (
    <section className="relative h-[90vh] min-h-[540px] bg-cinema-900 animate-pulse flex items-end">
      <div className="px-6 pb-20 md:px-12 max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-4 bg-cinema-700 rounded-full w-12" />
          <div className="h-4 bg-cinema-700 rounded-full w-10" />
        </div>
        <div className="h-12 bg-cinema-700 rounded-lg w-3/4 mb-3" />
        <div className="h-12 bg-cinema-700 rounded-lg w-1/2 mb-6" />
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-cinema-700 rounded w-full" />
          <div className="h-4 bg-cinema-700 rounded w-5/6" />
          <div className="h-4 bg-cinema-700 rounded w-4/6" />
        </div>
        <div className="h-12 bg-cinema-700 rounded-lg w-36" />
      </div>
    </section>
  );
}
