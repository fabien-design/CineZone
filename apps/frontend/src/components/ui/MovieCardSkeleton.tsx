export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-cinema-800 animate-pulse">
      <div className="aspect-[2/3] bg-cinema-700" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-cinema-700 rounded w-3/4" />
        <div className="h-3 bg-cinema-700 rounded w-1/3" />
      </div>
    </div>
  );
}
