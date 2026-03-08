import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, TrendingUp, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { mongodb } from "@/lib/mongodb";

interface SharedAnswer {
  question_text: string;
  question_type: string;
  answer_text: string;
  score: number | null;
  overall_feedback: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  suggested_answer: string | null;
}

interface SharedInterview {
  job_description: string;
  average_score: number | null;
  total_questions: number;
  completed_at: string;
  answers: SharedAnswer[];
}

const SharedResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SharedInterview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const result = await mongodb.getShared(id!);
        if (result.error) throw new Error(result.error);
        setData({
          job_description: result.interview.job_description,
          average_score: result.interview.average_score,
          total_questions: result.interview.total_questions,
          completed_at: result.interview.completed_at,
          answers: result.answers,
        });
      } catch (e: any) {
        setError(e.message || "Failed to load shared results");
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading shared results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center max-w-md">
          <p className="text-destructive mb-4">{error || "Results not found"}</p>
          <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const avgScore = data.average_score || 0;
  const scoreColor = avgScore >= 7 ? "text-primary" : avgScore >= 5 ? "text-warning" : "text-destructive";
  const strongAnswers = data.answers.filter((a) => (a.score || 0) >= 7).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <div className="text-center mb-10 animate-slide-up">
          <Badge variant="outline" className="mb-4 text-xs">Shared Results</Badge>
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-display mb-2">Interview Results</h1>
          <p className="text-muted-foreground text-sm">
            Completed on {new Date(data.completed_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center border-glow">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className={`font-mono text-2xl font-bold ${scoreColor}`}>{avgScore.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-accent">{strongAnswers}</p>
            <p className="text-xs text-muted-foreground mt-1">Strong Answers</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <Trophy className="w-5 h-5 text-warning mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-warning">{data.total_questions}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
        </div>

        <div className="space-y-3 animate-slide-up">
          {data.answers.map((a, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center font-mono font-bold text-sm ${
                  (a.score || 0) >= 7
                    ? "bg-primary/10 text-primary"
                    : (a.score || 0) >= 5
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {a.score || 0}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{a.question_text}</p>
                  <Badge variant="outline" className="text-xs mt-1">{a.question_type}</Badge>
                </div>
                {expandedIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {expandedIndex === i && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Answer</p>
                    <p className="text-sm text-card-foreground/80">{a.answer_text}</p>
                  </div>
                  {a.overall_feedback && (
                    <div>
                      <p className="text-xs font-medium text-primary mb-1">Feedback</p>
                      <p className="text-sm text-card-foreground/80">{a.overall_feedback}</p>
                    </div>
                  )}
                  {a.suggested_answer && (
                    <div>
                      <p className="text-xs font-medium text-accent mb-1">Suggested Answer</p>
                      <p className="text-sm text-card-foreground/70 leading-relaxed">{a.suggested_answer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/upload")}>
            Try It Yourself
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharedResults;
