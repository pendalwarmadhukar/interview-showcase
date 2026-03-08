import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Terminal, Sparkles, History, LogIn, LogOut, BarChart3, Menu, X, UserCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    };
    fetch();
  }, [user]);

  const initials = profile?.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  const navLinks = (
    <>
      <Link
        to="/upload"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <Sparkles className="w-4 h-4" />
        New Interview
      </Link>
      {user && (
        <>
          <Link
            to="/history"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>
        </>
      )}
      <ThemeToggle />
      {user ? (
        <div className="flex items-center gap-2">
          <Link to="/profile" onClick={() => setMobileOpen(false)}>
            <Avatar className="w-7 h-7 border border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || "Avatar"} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileOpen(false); }} className="text-xs text-muted-foreground">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      ) : (
        <Link to="/auth" onClick={() => setMobileOpen(false)}>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-md bg-primary/10 glow-primary group-hover:bg-primary/20 transition-colors">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Interview<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4 animate-slide-up">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
