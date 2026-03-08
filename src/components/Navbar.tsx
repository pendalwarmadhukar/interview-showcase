import { Link } from "react-router-dom";
import { Terminal, Code2, Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-md bg-primary/10 glow-primary group-hover:bg-primary/20 transition-colors">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Code<span className="text-primary">Forge</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/problems"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Code2 className="w-4 h-4" />
            Problems
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
            <Zap className="w-4 h-4" />
            <span className="font-mono text-primary">4</span>
            <span>/10 solved</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
