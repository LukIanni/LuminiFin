import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface SpendingChartProps {
  data: SpendingCategory[];
  title?: string;
}

export function SpendingChart({ data, title = "Gastos por Categoria" }: SpendingChartProps) {
  const total = data.reduce((sum, item) => {
    const value = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64" role="img" aria-label={`Gráfico de pizza mostrando ${title}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string, name: string, props: any) => {
                  const numValue = typeof value === 'string' ? parseFloat(value) : value;
                  const category = props.payload.name;
                  return [
                    `${category} - R$ ${numValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  ];
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Total */}
        <div className="text-center mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Total do período</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
