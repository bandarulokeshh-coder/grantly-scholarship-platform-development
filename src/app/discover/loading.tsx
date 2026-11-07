import { CardSkeletonList } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DiscoverLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <CardSkeletonList count={3} />
        </div>
      </div>
      <p className="sr-only">Loading scholarships</p>
    </div>
  );
}
