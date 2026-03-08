import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard";
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-xs font-medium border-0 px-2.5 py-0.5",
        difficulty === "Easy" && "bg-easy/15 text-easy",
        difficulty === "Medium" && "bg-medium/15 text-medium",
        difficulty === "Hard" && "bg-hard/15 text-hard"
      )}
    >
      {difficulty}
    </Badge>
  );
};

export default DifficultyBadge;
