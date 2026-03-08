import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, KeyRound } from "lucide-react";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="rounded-lg border border-border/60 bg-card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-medium text-card-foreground">Change Password</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-xs">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 bg-secondary/40 border-border/40"
            minLength={6}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 bg-secondary/40 border-border/40"
            minLength={6}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={saving || !newPassword || !confirmPassword} variant="outline" className="w-full">
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
        ) : (
          <><KeyRound className="w-4 h-4" /> Update Password</>
        )}
      </Button>
    </form>
  );
};

export default ChangePassword;
