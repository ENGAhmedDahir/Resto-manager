import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-md" />
      ))}
    </div>
  );
}
