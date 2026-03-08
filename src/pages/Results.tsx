import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, Target, TrendingUp, ChevronDown, ChevronUp, Save, Loader2, Download, Share2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface ResultItem {
  question: {
    id: number;
    question: string;
    type: string;
    hint: string;
  };
  answer: string;
  evaluation: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestedAnswer: string;
    overallFeedback: string;
  } | null;
}

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<ResultItem[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("interview_results");
    if (!raw) {
      navigate("/");
      return;
    }
    setResults(JSON.parse(raw));
  }, [navigate]);

  // Auto-save when user is logged in
  useEffect(() => {
    if (user && results.length > 0 && !saved) {
      saveToDatabase();
    }
  }, [user, results]);

  const saveToDatabase = async () => {
    if (!user || saved || saving) return;
    setSaving(true);

    try {
      const jobDescription = sessionStorage.getItem("interview_data");
      const jd = jobDescription ? JSON.parse(jobDescription).jobDescription : "Unknown";
      const avgScore = results.reduce((sum, r) => sum + (r.evaluation?.score || 0), 0) / results.length;

      const { data: interview, error: intError } = await supabase
        .from("interviews")
        .insert({
          user_id: user.id,
          job_description: jd,
          average_score: parseFloat(avgScore.toFixed(2)),
          total_questions: results.length,
        })
        .select("id")
        .single();

      if (intError) throw intError;
      setInterviewId(interview.id);

      const answers = results.map((r) => ({
        interview_id: interview.id,
        user_id: user.id,
        question_text: r.question.question,
        question_type: r.question.type,
        answer_text: r.answer,
        score: r.evaluation?.score || null,
        strengths: r.evaluation?.strengths || [],
        improvements: r.evaluation?.improvements || [],
        suggested_answer: r.evaluation?.suggestedAnswer || null,
        overall_feedback: r.evaluation?.overallFeedback || null,
      }));

      const { error: ansError } = await supabase.from("interview_answers").insert(answers);
      if (ansError) throw ansError;

      setSaved(true);
      toast.success("Interview saved to your history!");
    } catch (e: any) {
      console.error("Save error:", e);
      toast.error("Failed to save interview");
    } finally {
      setSaving(false);
    }
  };

  const downloadResults = () => {
    const jobDescription = sessionStorage.getItem("interview_data");
    const jd = jobDescription ? JSON.parse(jobDescription).jobDescription : "Unknown";
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text: string, size: number, color: [number, number, number] = [30, 30, 30], bold = false) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);
      if (y + lines.length * (size * 0.5) > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 2;
    };

    const addLine = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    // Header
    addText("Mock Interview Results", 22, [59, 130, 246], true);
    y += 2;
    addText(`Date: ${new Date().toLocaleDateString()}`, 10, [120, 120, 120]);
    addText(`Average Score: ${avgScore.toFixed(1)}/10  |  Strong Answers: ${results.filter((r) => (r.evaluation?.score || 0) >= 7).length}/${results.length}`, 11, [80, 80, 80]);
    y += 2;
    addText(`Job: ${jd.substring(0, 150)}${jd.length > 150 ? "..." : ""}`, 9, [140, 140, 140]);
    y += 4;
    addLine();

    results.forEach((r, i) => {
      const score = r.evaluation?.score || 0;
      const scoreColor: [number, number, number] = score >= 7 ? [34, 197, 94] : score >= 5 ? [234, 179, 8] : [239, 68, 68];

      addText(`Q${i + 1}. ${r.question.question}`, 12, [30, 30, 30], true);
      addText(`[${r.question.type.toUpperCase()}]  Score: ${score}/10`, 10, scoreColor, true);
      y += 2;

      addText("Your Answer:", 9, [100, 100, 100], true);
      addText(r.answer, 10, [60, 60, 60]);
      y += 2;

      if (r.evaluation) {
        addText("Feedback:", 9, [59, 130, 246], true);
        addText(r.evaluation.overallFeedback, 10, [60, 60, 60]);
        y += 1;

        if (r.evaluation.strengths.length > 0) {
          addText("Strengths:", 9, [34, 197, 94], true);
          r.evaluation.strengths.forEach((s) => addText(`  ✓ ${s}`, 9, [60, 60, 60]));
          y += 1;
        }

        if (r.evaluation.improvements.length > 0) {
          addText("Areas to Improve:", 9, [234, 179, 8], true);
          r.evaluation.improvements.forEach((s) => addText(`  • ${s}`, 9, [60, 60, 60]));
          y += 1;
        }

        addText("Suggested Answer:", 9, [139, 92, 246], true);
        addText(r.evaluation.suggestedAnswer, 9, [80, 80, 80]);
      }
      y += 4;
      addLine();
    });

    doc.save(`interview-results-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded!");
  };

  const avgScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.evaluation?.score || 0), 0) / results.length
      : 0;

  const scoreColor = avgScore >= 7 ? "text-primary" : avgScore >= 5 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-3xl">
        {/* Summary */}
        <div className="text-center mb-10 animate-slide-up">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-display mb-2">Interview Complete</h1>
          <p className="text-muted-foreground text-sm">Here's how you performed</p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center border-glow">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className={`font-mono text-2xl font-bold ${scoreColor}`}>
              {avgScore.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-accent">
              {results.filter((r) => (r.evaluation?.score || 0) >= 7).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Strong Answers</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <Trophy className="w-5 h-5 text-warning mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold text-warning">
              {results.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
        </div>

        {/* Save status */}
        {user && (
          <div className={`text-center text-xs mb-4 ${saved ? "text-primary" : "text-muted-foreground"}`}>
            {saving ? (
              <span className="flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>
            ) : saved ? (
              <span className="flex items-center justify-center gap-1"><Save className="w-3 h-3" /> Saved to history</span>
            ) : null}
          </div>
        )}

        {!user && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-6 text-center">
            <p className="text-xs text-muted-foreground">
              <button onClick={() => navigate("/auth")} className="text-primary font-medium hover:underline">Sign in</button>
              {" "}to save this interview to your history
            </p>
          </div>
        )}

        {/* Question breakdown */}
        <div className="space-y-3 animate-slide-up">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
              >
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-mono font-bold text-sm ${
                    (r.evaluation?.score || 0) >= 7
                      ? "bg-primary/10 text-primary"
                      : (r.evaluation?.score || 0) >= 5
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {r.evaluation?.score || 0}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {r.question.question}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {r.question.type}
                  </Badge>
                </div>
                {expandedIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {expandedIndex === i && r.evaluation && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Your Answer</p>
                    <p className="text-sm text-card-foreground/80">{r.answer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">Feedback</p>
                    <p className="text-sm text-card-foreground/80">{r.evaluation.overallFeedback}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-accent mb-1">Suggested Answer</p>
                    <p className="text-sm text-card-foreground/70 leading-relaxed">
                      {r.evaluation.suggestedAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/upload")}>
            <RotateCcw className="w-4 h-4" /> Try Another
          </Button>
          <Button variant="outline" className="flex-1" onClick={downloadResults}>
            <Download className="w-4 h-4" /> Download
          </Button>
          {user && (
            <Button variant="outline" className="flex-1" onClick={() => navigate("/history")}>
              View History
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
