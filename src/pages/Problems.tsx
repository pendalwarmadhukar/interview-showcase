import { useState } from "react";
import { questions, categories } from "@/data/questions";
import QuestionRow from "@/components/QuestionRow";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const Problems = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);

  const filtered = questions.filter((q) => {
    const catMatch = activeCategory === "All" || q.category === activeCategory;
    const diffMatch = !activeDifficulty || q.difficulty === activeDifficulty;
    return catMatch && diffMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold font-display mb-1">Problems</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {questions.filter((q) => q.solved).length}/{questions.length} solved
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                activeCategory === cat
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
          <div className="w-px bg-border mx-1" />
          {["Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setActiveDifficulty(activeDifficulty === diff ? null : diff)
              }
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                activeDifficulty === diff
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Question list */}
        <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-secondary/30">
            <span className="text-xs text-muted-foreground font-medium">
              Title
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                Acceptance
              </span>
              <span className="text-xs text-muted-foreground font-medium w-16 text-right">
                Difficulty
              </span>
            </div>
          </div>
          {filtered.map((q) => (
            <QuestionRow key={q.id} question={q} />
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No problems found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
