import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { questions } from "@/data/questions";
import { Code2, Terminal, Braces, ArrowRight, Zap } from "lucide-react";

const stats = {
  total: questions.length,
  solved: questions.filter((q) => q.solved).length,
  easy: questions.filter((q) => q.difficulty === "Easy").length,
  medium: questions.filter((q) => q.difficulty === "Medium").length,
  hard: questions.filter((q) => q.difficulty === "Hard").length,
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container py-20 lg:py-32 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8 animate-slide-up">
          <Zap className="w-3.5 h-3.5" />
          {stats.total} problems • {stats.solved} solved
        </div>

        <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6 animate-slide-up">
          Master the
          <br />
          <span className="text-gradient-primary">Technical Interview</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 animate-slide-up">
          Practice coding problems, sharpen your algorithms, and land your dream
          job. One problem at a time.
        </p>

        <Link
          to="/problems"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all glow-primary animate-slide-up"
        >
          Start Practicing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Stats cards */}
      <section className="container max-w-4xl pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/60 bg-card p-5 border-glow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-md bg-easy/10">
                <Terminal className="w-4 h-4 text-easy" />
              </div>
              <span className="text-sm font-medium text-card-foreground">Easy</span>
            </div>
            <p className="font-mono text-2xl font-bold text-easy">{stats.easy}</p>
            <p className="text-xs text-muted-foreground mt-1">problems</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-card p-5 border-glow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-md bg-medium/10">
                <Code2 className="w-4 h-4 text-medium" />
              </div>
              <span className="text-sm font-medium text-card-foreground">Medium</span>
            </div>
            <p className="font-mono text-2xl font-bold text-medium">{stats.medium}</p>
            <p className="text-xs text-muted-foreground mt-1">problems</p>
          </div>

          <div className="rounded-lg border border-border/60 bg-card p-5 border-glow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-md bg-hard/10">
                <Braces className="w-4 h-4 text-hard" />
              </div>
              <span className="text-sm font-medium text-card-foreground">Hard</span>
            </div>
            <p className="font-mono text-2xl font-bold text-hard">{stats.hard}</p>
            <p className="text-xs text-muted-foreground mt-1">problems</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
