import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import OnboardingDialog from "@/components/OnboardingDialog";
import { Sparkles, FileText, MessageSquare, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Upload Job Description",
    description: "Paste or upload a job description PDF/text file",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Answer Questions",
    description: "AI generates tailored interview questions for you",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Trophy,
    title: "Get Feedback",
    description: "Receive detailed scoring and improvement tips",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="AI Mock Interview Practice" description="Practice job interviews with AI-generated questions tailored to your job description. Get instant feedback and improve your interview skills." />
      <OnboardingDialog />
      <Navbar />

      {/* Hero */}
      <section className="container py-20 lg:py-32 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8 animate-slide-up">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Mock Interviews
        </div>

        <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6 animate-slide-up">
          Ace Your Next
          <br />
          <span className="text-gradient-primary">Job Interview</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 animate-slide-up">
          Upload a job description, practice with AI-generated questions, and get instant feedback on your answers.
        </p>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all glow-primary animate-slide-up"
        >
          Start Mock Interview
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* How it works */}
      <section className="container max-w-4xl pb-20">
        <h2 className="text-center text-sm font-mono text-muted-foreground mb-8 uppercase tracking-wider">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/60 bg-card p-5 border-glow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-md ${step.bg}`}>
                  <step.icon className={`w-4 h-4 ${step.color}`} />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <p className="text-sm font-medium text-card-foreground mb-1">
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
