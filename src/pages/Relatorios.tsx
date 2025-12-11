import { AppLayout } from "@/components/layout/AppLayout";
import { SpendingChart, SpendingCategory } from "@/components/reports/SpendingChart";
import { SummaryCard } from "@/components/reports/SummaryCard";
import { Wallet, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const spendingData: SpendingCategory[] = [
  { name: "Alimentação", value: 850, color: "hsl(162, 63%, 41%)" },
  { name: "Transporte", value: 420, color: "hsl(45, 90%, 55%)" },
  { name: "Mercado", value: 680, color: "hsl(200, 70%, 50%)" },
  { name: "Lazer", value: 350, color: "hsl(280, 65%, 60%)" },
  { name: "Outros", value: 200, color: "hsl(340, 75%, 55%)" },
];

const recentTransactions = [
  { description: "Mercado Extra", category: "🛒 Mercado", amount: -156.80, date: "Hoje" },
  { description: "Uber", category: "🚗 Transporte", amount: -24.50, date: "Hoje" },
  { description: "iFood - Almoço", category: "🍽️ Alimentação", amount: -35.90, date: "Ontem" },
  { description: "Spotify", category: "🎵 Assinaturas", amount: -21.90, date: "Ontem" },
];

export default function Relatorios() {
  return (
    <AppLayout title="Relatórios" subtitle="Visão geral das finanças">
      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        {/* Summary cards */}
        <section aria-label="Resumo financeiro" className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Gastos do mês"
            value={2500}
            trend={12.5}
            icon={CreditCard}
          />
          <SummaryCard
            title="Economizado"
            value={850}
            trend={-8.2}
            icon={PiggyBank}
          />
          <SummaryCard
            title="Saldo atual"
            value={4250}
            icon={Wallet}
          />
          <SummaryCard
            title="Média diária"
            value={83.33}
            icon={TrendingDown}
          />
        </section>

        {/* Spending chart */}
        <SpendingChart data={spendingData} />

        {/* Recent transactions */}
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
      </div>
    </AppLayout>
  );
}
