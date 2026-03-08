import { Link } from "react-router-dom";
import { Terminal, Sparkles, History, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, signOut } = useAuth();

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
        <div className="flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Sparkles className="w-4 h-4" />
            New Interview
          </Link>
          {user && (
            <Link
              to="/history"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <History className="w-4 h-4" />
              History
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="text-xs text-muted-foreground">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
