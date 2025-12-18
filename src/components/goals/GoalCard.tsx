import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string | Date;
}

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = progress >= 100;

  return (
    <Card
      variant="interactive"
      className={cn(
        "animate-fade-in",
        isCompleted && "border-success/30 bg-success/5"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Meta: ${goal.title}. Progresso: ${progress.toFixed(0)}%`}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              isCompleted
                ? "bg-success/20 text-success"
                : "bg-primary/10 text-primary"
            )}
          >
            {isCompleted ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <Target className="w-6 h-6" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {goal.title}
            </h3>
            
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-primary">
                R$ {goal.currentAmount.toLocaleString("pt-BR")}
              </span>
              <span className="text-sm text-muted-foreground">
                / R$ {goal.targetAmount.toLocaleString("pt-BR")}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <Progress 
                value={progress} 
                className="h-2"
                aria-label={`${progress.toFixed(0)}% completo`}
              />
            </div>

            {/* Deadline */}
            {goal.deadline && (
              <p className="text-xs text-muted-foreground mt-2">
                Meta para{" "}
                {new Date(goal.deadline).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Progress badge */}
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold",
              isCompleted
                ? "bg-success/20 text-success"
                : "bg-primary/10 text-primary"
            )}
          >
            {progress.toFixed(0)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
