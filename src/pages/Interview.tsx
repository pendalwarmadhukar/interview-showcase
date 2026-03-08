import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lightbulb,
  Send,
  CheckCircle2,
  Trophy,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Timer,
  Pause,
  Play,
} from "lucide-react";
import { useSpeech, useRecognition } from "@/hooks/use-voice";
import { useTimer } from "@/hooks/use-timer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  type: "technical" | "behavioral" | "situational";
  hint: string;
}

interface Evaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  overallFeedback: string;
}

interface AnswerData {
  answer: string;
  evaluation: Evaluation | null;
  submitted: boolean;
}

const typeColors: Record<string, string> = {
  technical: "bg-accent/10 text-accent border-accent/30",
  behavioral: "bg-primary/10 text-primary border-primary/30",
  situational: "bg-warning/10 text-warning border-warning/30",
};

const Interview = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerData>>({});
  const [showHint, setShowHint] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeech();
  const { start: startListening, stop: stopListening, isListening } = useRecognition();

  const handleTimeUp = useCallback(() => {
    toast.warning("Time's up! Submit your answer now.");
  }, []);

  const [timeLimit, setTimeLimit] = useState(120);

  useEffect(() => {
    const raw = sessionStorage.getItem("interview_data");
    if (!raw) {
      navigate("/");
      return;
    }
    const data = JSON.parse(raw);
    setQuestions(data.questions);
    setJobDescription(data.jobDescription);
    if (data.timeLimit) setTimeLimit(data.timeLimit);
  }, [navigate]);

  const timer = useTimer(timeLimit, handleTimeUp);

  // Auto-speak question and reset timer when question changes
  useEffect(() => {
    if (currentQuestion && autoSpeak && !answers[currentIndex]?.submitted) {
      speak(currentQuestion.question);
    }
    if (currentQuestion && !answers[currentIndex]?.submitted) {
      timer.restart();
    } else {
      timer.reset();
    }
    return () => stopSpeaking();
  }, [currentIndex, questions.length]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] || { answer: "", evaluation: null, submitted: false };

  const updateAnswer = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { ...currentAnswer, answer: text },
    }));
  };

  const submitAnswer = async () => {
    if (!currentAnswer.answer.trim()) {
      toast.error("Please write an answer first");
      return;
    }
    setEvaluating(true);
    timer.pause();
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-answer", {
        body: {
          question: currentQuestion.question,
          answer: currentAnswer.answer,
          jobDescription,
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: {
          ...currentAnswer,
          evaluation: data.evaluation,
          submitted: true,
        },
      }));
    } catch (e: any) {
      toast.error(e.message || "Failed to evaluate answer");
    } finally {
      setEvaluating(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i]?.submitted);

  const finishInterview = () => {
    const results = questions.map((q, i) => ({
      question: q,
      answer: answers[i]?.answer || "",
      evaluation: answers[i]?.evaluation || null,
    }));
    sessionStorage.setItem("interview_results", JSON.stringify(results));
    navigate("/results");
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-3xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setShowHint(false); }}
              className={`h-2 flex-1 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary glow-primary"
                  : answers[i]?.submitted
                  ? "bg-primary/40"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>

          {/* Timer */}
          {!currentAnswer.submitted && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              timer.isCritical
                ? "border-destructive/50 bg-destructive/10 text-destructive animate-pulse"
                : timer.isLow
                ? "border-warning/50 bg-warning/10 text-warning"
                : "border-border/60 bg-secondary/50 text-muted-foreground"
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span className="w-10 text-center">{timer.formatted}</span>
              <button
                onClick={() => timer.isRunning ? timer.pause() : timer.start()}
                className="p-0.5 rounded hover:bg-background/50 transition-colors"
                title={timer.isRunning ? "Pause timer" : "Resume timer"}
              >
                {timer.isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          )}

          <Badge variant="outline" className={`text-xs ${typeColors[currentQuestion.type]}`}>
            {currentQuestion.type}
          </Badge>
        </div>

        {/* Question card */}
        <div className="rounded-lg border border-border/60 bg-card p-6 mb-6 border-glow">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-display font-bold text-card-foreground leading-relaxed flex-1">
              {currentQuestion.question}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speak(currentQuestion.question)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title={isSpeaking ? "Stop reading" : "Read question aloud"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
                  autoSpeak ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                }`}
                title={autoSpeak ? "Auto-read ON" : "Auto-read OFF"}
              >
                {autoSpeak ? "🔊" : "🔇"}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
              <p className="text-xs text-primary flex items-center gap-1.5 mb-1 font-medium">
                <Lightbulb className="w-3.5 h-3.5" /> Hint
              </p>
              <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
            </div>
          )}

          {!showHint && !currentAnswer.submitted && (
            <button
              onClick={() => setShowHint(true)}
              className="mt-3 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" /> Show hint
            </button>
          )}
        </div>

        {/* Answer area */}
        {!currentAnswer.submitted ? (
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={currentAnswer.answer}
                onChange={(e) => updateAnswer(e.target.value)}
                placeholder={isListening ? "🎤 Listening... speak your answer" : "Type or use the mic to speak your answer..."}
                className={`min-h-[180px] bg-card border-border/60 text-sm resize-none pr-14 ${
                  isListening ? "border-primary/50 ring-1 ring-primary/30" : ""
                }`}
                disabled={evaluating}
              />
              <button
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    stopSpeaking();
                    const supported = startListening((text) => updateAnswer(text));
                    if (!supported) {
                      toast.error("Speech recognition is not supported in this browser");
                    }
                  }
                }}
                disabled={evaluating}
                className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
                  isListening
                    ? "bg-destructive/20 text-destructive animate-pulse"
                    : "bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <Button
              onClick={() => { stopListening(); submitAnswer(); }}
              disabled={evaluating || !currentAnswer.answer.trim()}
              className="w-full glow-primary"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Answer
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Evaluation */
          <div className="space-y-4 animate-slide-up">
            {/* Your answer */}
            <div className="rounded-lg border border-border/40 bg-secondary/30 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Your Answer</p>
              <p className="text-sm text-card-foreground">{currentAnswer.answer}</p>
            </div>

            {currentAnswer.evaluation && (
              <>
                {/* Score */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
                  <div className="text-3xl font-mono font-bold text-primary">
                    {currentAnswer.evaluation.score}<span className="text-lg text-muted-foreground">/10</span>
                  </div>
                  <p className="text-sm text-card-foreground flex-1">
                    {currentAnswer.evaluation.overallFeedback}
                  </p>
                </div>

                {/* Strengths */}
                {currentAnswer.evaluation.strengths.length > 0 && (
                  <div className="rounded-lg border border-border/40 bg-card p-4">
                    <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {currentAnswer.evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-card-foreground/80">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {currentAnswer.evaluation.improvements.length > 0 && (
                  <div className="rounded-lg border border-border/40 bg-card p-4">
                    <p className="text-xs font-medium text-warning mb-2">Areas to Improve</p>
                    <ul className="space-y-1">
                      {currentAnswer.evaluation.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-card-foreground/80">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested answer */}
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <p className="text-xs font-medium text-accent mb-2">Suggested Answer</p>
                  <p className="text-sm text-card-foreground/80 leading-relaxed">
                    {currentAnswer.evaluation.suggestedAnswer}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => { setCurrentIndex((p) => p - 1); setShowHint(false); }}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={finishInterview} className="glow-primary" disabled={!allAnswered}>
              <Trophy className="w-4 h-4" /> View Results {!allAnswered && `(${Object.values(answers).filter(a => a.submitted).length}/${questions.length})`}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => { setCurrentIndex((p) => p + 1); setShowHint(false); }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
