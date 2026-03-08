import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";
import type { Question } from "@/data/questions";

interface QuestionRowProps {
  question: Question;
}

const QuestionRow = ({ question }: QuestionRowProps) => {
  return (
    <Link
      to={`/problems/${question.id}`}
      className="flex items-center justify-between px-4 py-3.5 border-b border-border/40 hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-muted-foreground w-8">
          {question.id}.
        </span>
        {question.solved ? (
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
        )}
        <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
          {question.title}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-mono hidden sm:block">
          {question.acceptance}%
        </span>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>
    </Link>
  );
};

export default QuestionRow;
