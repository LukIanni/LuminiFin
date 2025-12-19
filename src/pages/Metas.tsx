import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoalCard, Goal } from "@/components/goals/GoalCard";
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog";
import { EditGoalDialog } from "@/components/goals/EditGoalDialog";
import { GoalsTipsCard } from "@/components/goals/GoalsTipsCard";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGoals } from "@/contexts/GoalsContext";

export default function Metas() {
  const { goals, fetchGoals } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

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
            <CreateGoalDialog />
          </div>

          {goals.length === 0 ? (
            <Card variant="chat-secondary" className="animate-fade-in">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Você ainda não tem metas. Crie uma para começar a poupar! 🎯
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div 
                  key={goal.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-slide-up"
                >
                  <GoalCard 
                    goal={goal}
                    onClick={() => {
                      setSelectedGoal(goal);
                      setEditDialogOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI Tips */}
        <section aria-label="Dicas inteligentes">
          <GoalsTipsCard />
        </section>
      </div>

      <EditGoalDialog
        goal={selectedGoal}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </AppLayout>
  );
}
