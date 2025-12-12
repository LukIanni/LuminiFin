import { useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SpendingChart, SpendingCategory } from "@/components/reports/SpendingChart";
import { SummaryCard } from "@/components/reports/SummaryCard";
import { Wallet, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/contexts/ExpensesContext";

export default function Relatorios() {
  const { expenses, fetchExpenses } = useExpenses();

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calcular estatísticas baseado em despesas reais
  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthExpenses = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    });
    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      monthTotal,
      totalSpent,
      averageDaily: monthTotal / new Date().getDate(),
      saved: 0, // Pode ser integrado com goals
    };
  }, [expenses]);

  // Agrupar despesas por categoria
  const spendingData: SpendingCategory[] = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    const colors: Record<string, string> = {
      "Mercado": "hsl(162, 63%, 41%)",
      "Transporte": "hsl(45, 90%, 55%)",
      "Alimentação": "hsl(200, 70%, 50%)",
      "Saúde": "hsl(280, 65%, 60%)",
      "Lazer": "hsl(340, 75%, 55%)",
      "Outros": "hsl(160, 40%, 70%)",
    };

    expenses.forEach((expense) => {
      const category = expense.category.replace(/^[🛒🍽️🚗💊📝]\s/, "") || "Outros";
      categoryMap[category] = (categoryMap[category] || 0) + expense.amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || colors["Outros"],
    }));
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((expense) => ({
        description: expense.description,
        category: expense.category || "📝 Outros",
        amount: -expense.amount,
        date: new Date(expense.date).toLocaleDateString("pt-BR", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [expenses]);

  return (
    <AppLayout title="Relatórios" subtitle="Visão geral das finanças">
      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Summary cards */}
        <section aria-label="Resumo financeiro" className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Gastos do mês"
            value={stats.monthTotal}
            trend={stats.totalSpent > stats.monthTotal ? 15 : -5}
            icon={CreditCard}
          />
          <SummaryCard
            title="Economizado"
            value={stats.saved}
            trend={undefined}
            icon={PiggyBank}
          />
          <SummaryCard
            title="Saldo atual"
            value={5000 - stats.totalSpent}
            icon={Wallet}
          />
          <SummaryCard
            title="Média diária"
            value={stats.averageDaily}
            icon={TrendingDown}
          />
        </section>

        {/* Spending chart */}
        {spendingData.length > 0 ? (
          <SpendingChart data={spendingData} />
        ) : (
          <Card variant="elevated" className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma despesa registrada ainda. Comece a registrar seus gastos! 📊
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent transactions */}
        {recentTransactions.length > 0 && (
          <Card variant="elevated" className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Últimas transações</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border" role="list" aria-label="Lista de transações recentes">
                {recentTransactions.map((tx, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden="true">
                        {tx.category.split(" ")[0]}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-destructive">
                      R$ {Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
