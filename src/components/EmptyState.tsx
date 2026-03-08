import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="text-center py-16 rounded-lg border border-border/60 bg-card animate-slide-up">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-sm font-medium text-card-foreground mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} variant="outline" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
