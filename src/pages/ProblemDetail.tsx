import { useParams, Link } from "react-router-dom";
import { questions } from "@/data/questions";
import Navbar from "@/components/Navbar";
import DifficultyBadge from "@/components/DifficultyBadge";
import { ArrowLeft, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProblemDetail = () => {
  const { id } = useParams();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center text-muted-foreground">
          Problem not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-5xl">
        <Link
          to="/problems"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Problem description */}
          <div className="rounded-lg border border-border/60 bg-card p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-muted-foreground">
                  #{question.id}
                </span>
                <DifficultyBadge difficulty={question.difficulty} />
              </div>
              <h1 className="text-xl font-bold font-display">
                {question.title}
              </h1>
            </div>

            <p className="text-sm text-card-foreground/80 leading-relaxed">
              {question.description}
            </p>

            {/* Examples */}
            <div className="space-y-3">
              {question.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-md bg-secondary/60 border border-border/40 p-4 space-y-2"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    Example {i + 1}
                  </p>
                  <div className="font-mono text-xs space-y-1">
                    <p>
                      <span className="text-primary">Input:</span>{" "}
                      <span className="text-card-foreground">{ex.input}</span>
                    </p>
                    <p>
                      <span className="text-primary">Output:</span>{" "}
                      <span className="text-card-foreground">{ex.output}</span>
                    </p>
                    {ex.explanation && (
                      <p className="text-muted-foreground mt-1">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-secondary/50 text-muted-foreground border-border/60"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Code editor mock */}
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-hard/60" />
                <div className="w-3 h-3 rounded-full bg-medium/60" />
                <div className="w-3 h-3 rounded-full bg-easy/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">
                solution.ts
              </span>
            </div>
            <div className="flex-1 p-4 min-h-[400px]">
              <pre className="font-mono text-xs text-muted-foreground leading-relaxed">
                <code>{`// ${question.title}
// Difficulty: ${question.difficulty}

function solve(${question.category === "Arrays" ? "nums: number[]" : question.category === "Strings" ? "s: string" : "input: any"}): any {
  // Write your solution here
  
  
  
  return;
}`}</code>
              </pre>
            </div>
            <div className="px-4 py-3 border-t border-border/60 bg-secondary/20 flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-mono">
                TypeScript
              </span>
              <button className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors glow-primary">
                Run Code →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
