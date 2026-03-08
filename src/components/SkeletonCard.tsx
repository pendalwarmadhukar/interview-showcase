import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
}

const SkeletonCard = ({ lines = 3, showAvatar = false }: SkeletonCardProps) => (
  <div className="rounded-lg border border-border/60 bg-card p-4 space-y-3 animate-pulse">
    {showAvatar && (
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2 w-1/4" />
        </div>
      </div>
    )}
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
);

export default SkeletonCard;
