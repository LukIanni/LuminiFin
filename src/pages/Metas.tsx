import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoalCard, Goal } from "@/components/goals/GoalCard";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sampleGoals: Goal[] = [
  {
    id: "1",
    title: "Reserva de Emergência",
    targetAmount: 10000,
    currentAmount: 3500,
    deadline: new Date(2025, 11, 31),
  },
  {
    id: "2",
    title: "Viagem de Férias",
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: new Date(2025, 6, 15),
  },
  {
    id: "3",
    title: "Notebook Novo",
    targetAmount: 4500,
    currentAmount: 4500,
  },
];

export default function Metas() {
  const [goals] = useState<Goal[]>(sampleGoals);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <AppLayout title="Metas" subtitle="Seus objetivos financeiros">
      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Summary card */}
        <Card variant="gradient" className="animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total guardado</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalSaved.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meta total</span>
              <span className="font-medium">
                R$ {totalTarget.toLocaleString("pt-BR")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Goals list */}
        <section aria-label="Lista de metas">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Suas metas</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="w-4 h-4 mr-1" />
              Nova meta
            </Button>
          </div>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div 
                key={goal.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <GoalCard goal={goal} />
              </div>
            ))}
          </div>
        </section>

        {/* AI tip */}
        <Card variant="chat-primary" className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Dica do LuminiFin</p>
                <p className="text-sm mt-1 opacity-90">
                  Você está a apenas R$ 2.200 de completar sua meta de viagem! 
                  Que tal guardar mais R$ 550 por mês?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
