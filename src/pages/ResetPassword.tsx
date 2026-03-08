import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated! You're now signed in.");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 max-w-sm text-center">
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/auth")}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16 max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-display mb-2">Set New Password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-card border-border/60"
                minLength={6}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full glow-primary">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
