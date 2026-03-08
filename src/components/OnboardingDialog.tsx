import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Trophy, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to InterviewAI!",
    description: "Practice job interviews with AI-generated questions tailored to your specific role. Let's walk you through how it works.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: FileText,
    title: "Upload a Job Description",
    description: "Paste or upload a job description and our AI will generate custom interview questions based on the role requirements.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Answer Questions",
    description: "Type or use voice input to answer each question. You'll get a timer, hints, and the ability to pause — just like a real interview.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Trophy,
    title: "Get Instant Feedback",
    description: "Each answer is scored with detailed feedback, strengths, areas to improve, and a suggested answer. Track your progress over time!",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const OnboardingDialog = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("onboarding_seen");
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("onboarding_seen", "true");
    setOpen(false);
  };

  const handleFinish = () => {
    handleClose();
    navigate("/upload");
  };

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`w-12 h-12 rounded-lg ${current.bg} flex items-center justify-center mx-auto mb-3`}>
            <Icon className={`w-6 h-6 ${current.color}`} />
          </div>
          <DialogTitle className="text-center text-lg">{current.title}</DialogTitle>
          <DialogDescription className="text-center text-sm">
            {current.description}
          </DialogDescription>
        </DialogHeader>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 my-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-primary w-6" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          {step > 0 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {!isLast ? (
            <Button className="flex-1 glow-primary" onClick={() => setStep(step + 1)}>
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="flex-1 glow-primary" onClick={handleFinish}>
              Start Practicing <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <button onClick={handleClose} className="text-xs text-muted-foreground hover:text-foreground text-center mt-1 transition-colors">
          Skip tutorial
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
