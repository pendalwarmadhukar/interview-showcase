import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { mongodb } from "@/lib/mongodb";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, History, Target, TrendingUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface InterviewRecord {
  id: string;
  job_description: string;
  average_score: number | null;
  total_questions: number;
  completed_at: string;
  answers?: AnswerRecord[];
}

interface AnswerRecord {
  id: string;
  question_text: string;
  question_type: string;
  answer_text: string;
  score: number | null;
  strengths: string[] | null;
  improvements: string[] | null;
  suggested_answer: string | null;
  overall_feedback: string | null;
}

const InterviewHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingAnswers, setLoadingAnswers] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchInterviews = async () => {
      try {
        const result = await mongodb.getInterviews();
        if (result?.data) setInterviews(result.data as InterviewRecord[]);
      } catch (e) {
        console.error("Fetch interviews error:", e);
      }
      setLoading(false);
    };
    fetchInterviews();
  }, [user]);

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);

    const interview = interviews.find((i) => i.id === id);
    if (interview?.answers) return;

    setLoadingAnswers(id);
    const { data } = await supabase
      .from("interview_answers")
      .select("*")
      .eq("interview_id", id)
      .order("created_at", { ascending: true });

    if (data) {
      setInterviews((prev) =>
        prev.map((i) => (i.id === id ? { ...i, answers: data as AnswerRecord[] } : i))
      );
    }
    setLoadingAnswers(null);
  };

  const scoreColor = (score: number | null) =>
    (score || 0) >= 7 ? "text-primary" : (score || 0) >= 5 ? "text-warning" : "text-destructive";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              Interview History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {interviews.length} interview{interviews.length !== 1 ? "s" : ""} completed
            </p>
          </div>
          <Button onClick={() => navigate("/upload")} className="glow-primary">
            <Sparkles className="w-4 h-4" /> New Interview
          </Button>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-16 rounded-lg border border-border/60 bg-card">
            <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No interviews yet. Start your first one!</p>
            <Button onClick={() => navigate("/upload")} className="mt-4" variant="outline">
              Start Interview
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div key={interview.id} className="rounded-lg border border-border/60 bg-card overflow-hidden">
                <button
                  onClick={() => toggleExpand(interview.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center font-mono font-bold ${scoreColor(interview.average_score)} bg-secondary/50`}>
                    {interview.average_score?.toFixed(1) || "—"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {interview.job_description.slice(0, 80)}...
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(interview.completed_at).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {interview.total_questions} questions
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${scoreColor(interview.average_score)}`} />
                    {expandedId === interview.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedId === interview.id && (
                  <div className="border-t border-border/40 p-4 space-y-3">
                    {loadingAnswers === interview.id ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : interview.answers ? (
                      interview.answers.map((a) => (
                        <div key={a.id} className="rounded-md border border-border/30 bg-secondary/20 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-sm font-bold ${scoreColor(a.score)}`}>
                              {a.score}/10
                            </span>
                            <Badge variant="outline" className="text-xs">{a.question_type}</Badge>
                          </div>
                          <p className="text-sm font-medium text-card-foreground">{a.question_text}</p>
                          <p className="text-xs text-muted-foreground">{a.overall_feedback}</p>
                        </div>
                      ))
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
