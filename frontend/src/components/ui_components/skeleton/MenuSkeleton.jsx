import { Skeleton } from "../../ui/skeleton";

export default function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {" "}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          {" "}
          <Skeleton className="h-[120px] w-full rounded-lg" />{" "}
          <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-3 w-1/2" />{" "}
        </div>
      ))}{" "}
    </div>
  );
}
