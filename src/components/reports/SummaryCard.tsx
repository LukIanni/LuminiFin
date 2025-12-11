import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
  format?: "currency" | "number" | "percent";
}

export function SummaryCard({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  format = "currency" 
}: SummaryCardProps) {
  const formatValue = () => {
    switch (format) {
      case "currency":
        return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("pt-BR");
    }
  };

  const TrendIcon = trend === undefined 
    ? Minus 
    : trend > 0 
      ? TrendingUp 
      : TrendingDown;

  const trendColor = trend === undefined
    ? "text-muted-foreground"
    : trend > 0
      ? "text-destructive"
      : "text-success";

  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-foreground mt-1">
              {formatValue()}
            </p>
            
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 mt-2 text-xs", trendColor)}>
                <TrendIcon className="w-3 h-3" />
                <span>
                  {Math.abs(trend).toFixed(1)}% vs. mês anterior
                </span>
              </div>
            )}
          </div>
          
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
