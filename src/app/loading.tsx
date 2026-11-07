import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="space-y-14">
        {/* Hero shimmer */}
        <div className="space-y-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Journey cards shimmer */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Closing soon cards shimmer */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}