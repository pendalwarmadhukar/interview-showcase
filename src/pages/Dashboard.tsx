import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { mongodb } from "@/lib/mongodb";
import { useAuth } from "@/contexts/AuthContext";
import SEOHead from "@/components/SEOHead";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Loader2, TrendingUp, Target, Trophy, BarChart3, Sparkles } from "lucide-react";

interface InterviewData {
  id: string;
  average_score: number | null;
  total_questions: number;
  completed_at: string;
}

interface AnswerData {
  question_type: string;
  score: number | null;
}

const COLORS = ["hsl(145, 80%, 50%)", "hsl(180, 70%, 45%)", "hsl(45, 90%, 55%)"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const result = await mongodb.getDashboard();
        if (result?.interviews) setInterviews(result.interviews as InterviewData[]);
        if (result?.answers) setAnswers(result.answers as AnswerData[]);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Dashboard" description="Track your mock interview performance with detailed analytics." />
        <Navbar />
        <div className="container py-12 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} lines={2} />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} lines={6} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Score trend data
  const trendData = interviews.map((i, idx) => ({
    name: `#${idx + 1}`,
    score: i.average_score ?? 0,
    date: new Date(i.completed_at).toLocaleDateString(),
  }));

  // Stats
  const totalInterviews = interviews.length;
  const totalQuestions = interviews.reduce((s, i) => s + i.total_questions, 0);
  const overallAvg = totalInterviews > 0
    ? interviews.reduce((s, i) => s + (i.average_score ?? 0), 0) / totalInterviews
    : 0;
  const bestScore = interviews.reduce((max, i) => Math.max(max, i.average_score ?? 0), 0);

  // Score by type
  const typeMap: Record<string, { total: number; count: number }> = {};
  answers.forEach((a) => {
    if (!typeMap[a.question_type]) typeMap[a.question_type] = { total: 0, count: 0 };
    typeMap[a.question_type].total += a.score ?? 0;
    typeMap[a.question_type].count += 1;
  });
  const typeData = Object.entries(typeMap).map(([type, { total, count }]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    avg: parseFloat((total / count).toFixed(1)),
    count,
  }));

  // Score distribution
  const distribution = [
    { name: "7-10", value: answers.filter((a) => (a.score ?? 0) >= 7).length },
    { name: "4-6", value: answers.filter((a) => (a.score ?? 0) >= 4 && (a.score ?? 0) < 7).length },
    { name: "1-3", value: answers.filter((a) => (a.score ?? 0) >= 1 && (a.score ?? 0) < 4).length },
  ];

  const isEmpty = totalInterviews === 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Dashboard" description="Track your mock interview performance with detailed analytics." />
      <Navbar />
      <div className="container py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track your interview performance</p>
          </div>
          <Button onClick={() => navigate("/upload")} className="glow-primary">
            <Sparkles className="w-4 h-4" /> New Interview
          </Button>
        </div>

        {isEmpty ? (
          <EmptyState
            icon={Target}
            title="No interviews yet"
            description="Complete your first interview to see analytics and track your progress over time."
            actionLabel="Start Interview"
            onAction={() => navigate("/upload")}
          />
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Target, label: "Avg Score", value: overallAvg.toFixed(1), color: "text-primary" },
                { icon: Trophy, label: "Best Score", value: bestScore.toFixed(1), color: "text-warning" },
                { icon: TrendingUp, label: "Interviews", value: totalInterviews.toString(), color: "text-accent" },
                { icon: BarChart3, label: "Questions", value: totalQuestions.toString(), color: "text-primary" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-lg border border-border/60 bg-card p-4 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                  <p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Score Trend */}
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <h3 className="text-sm font-medium text-card-foreground mb-4">Score Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "hsl(150, 60%, 90%)" }}
                    />
                    <Line type="monotone" dataKey="score" stroke="hsl(145, 80%, 50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(145, 80%, 50%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Score by Type */}
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <h3 className="text-sm font-medium text-card-foreground mb-4">Score by Question Type</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Score Distribution */}
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <h3 className="text-sm font-medium text-card-foreground mb-4">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={distribution.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {distribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent interviews */}
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <h3 className="text-sm font-medium text-card-foreground mb-4">Recent Interviews</h3>
                <div className="space-y-3">
                  {interviews.slice(-5).reverse().map((i, idx) => (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                        (i.average_score ?? 0) >= 7 ? "bg-primary/10 text-primary" :
                        (i.average_score ?? 0) >= 5 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      }`}>
                        {i.average_score?.toFixed(1) ?? "—"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(i.completed_at).toLocaleDateString()} · {i.total_questions} questions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
