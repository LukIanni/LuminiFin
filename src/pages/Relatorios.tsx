import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SpendingChart, SpendingCategory } from "@/components/reports/SpendingChart";
import { SummaryCard } from "@/components/reports/SummaryCard";
import { Wallet, TrendingDown, PiggyBank, CreditCard, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useExpenses } from "@/contexts/ExpensesContext";
import { toast } from "@/hooks/use-toast";

export default function Relatorios() {
  const { expenses, balance, fetchExpenses, getBalance, setBalance } = useExpenses();
  
  // Estado para período
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Estado para edição de saldo
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState<string>(balance.toString());
  
  // Estado para modal de detalhes
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  // Estado para drawer de transações
  const [isOpenTransactions, setIsOpenTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 3;

  useEffect(() => {
    fetchExpenses();
    getBalance();
  }, []);

  useEffect(() => {
    setBalanceInput(balance.toString());
  }, [balance]);

  // Filtrar despesas por período
  const filteredExpenses = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, startDate, endDate]);

  // Calcular estatísticas baseado em despesas filtradas
  const stats = useMemo(() => {
    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount), 0);
    const averageDaily = filteredExpenses.length > 0 
      ? totalSpent / Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const saved = balance - totalSpent;
    
    return {
      totalSpent,
      averageDaily,
      saved: saved > 0 ? saved : 0,
    };
  }, [filteredExpenses, balance, startDate, endDate]);

  // Agrupar despesas por categoria
  const spendingData: SpendingCategory[] = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    const colors: Record<string, string> = {
      "Mercado": "hsl(162, 63%, 41%)",
      "Alimentação": "hsl(200, 70%, 50%)",
      "Transporte": "hsl(45, 90%, 55%)",
      "Moradia": "hsl(120, 60%, 50%)",
      "Lazer": "hsl(340, 75%, 55%)",
      "Saúde": "hsl(280, 65%, 60%)",
      "Educação": "hsl(260, 70%, 50%)",
      "Vestuário": "hsl(10, 80%, 50%)",
      "Serviços": "hsl(30, 80%, 50%)",
      "Investimentos": "hsl(140, 70%, 50%)",
      "Outros": "hsl(160, 40%, 70%)",
    };

    filteredExpenses.forEach((expense) => {
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
      const category = expense.category.replace(/^[🛒🍽️🚗💊📝🏠🎮🏥📚👕🔧💰🏪]\s/, "") || "Outros";
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        color: colors[name] || colors["Outros"],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  const recentTransactions = useMemo(() => {
    return filteredExpenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((expense) => ({
        description: expense.description,
        category: expense.category || "📝 Outros",
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
        date: new Date(expense.date).toLocaleDateString("pt-BR", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [filteredExpenses]);

  // Paginação de transações
  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
    return recentTransactions.slice(startIdx, startIdx + TRANSACTIONS_PER_PAGE);
  }, [recentTransactions, currentPage]);

  const totalPages = Math.ceil(recentTransactions.length / TRANSACTIONS_PER_PAGE);

  // Handlers para saldo
  const handleSaveBalance = async () => {
    try {
      const newBalance = parseFloat(balanceInput);
      if (isNaN(newBalance)) {
        toast({ title: "Erro", description: "Valor inválido", variant: "destructive" });
        return;
      }
      await setBalance(newBalance);
      setIsEditingBalance(false);
      toast({ title: "Sucesso", description: "Saldo atualizado" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AppLayout title="Relatórios" subtitle="Visão geral das finanças">
      <div className="px-4 py-4 max-w-md mx-auto space-y-6">
        
        {/* Period selector */}
        <Card variant="elevated" className="p-3">
          <p className="font-semibold tracking-tight text-base">Período</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">De:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Até:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Summary cards */}
        <section aria-label="Resumo financeiro" className="grid grid-cols-2 gap-3">
          {/* Saldo Atual Card com edição */}
          <Card variant="elevated" className="animate-slide-up">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Saldo atual</p>
                  {isEditingBalance ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        type="number"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="text-lg font-bold"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveBalance}
                          className="flex-1"
                        >
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingBalance(false);
                            setBalanceInput(balance.toString());
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-foreground mt-1">
                        R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingBalance(true)}
                        className="mt-2 h-7 text-xs"
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <SummaryCard
            title="Gastos do período"
            value={stats.totalSpent}
            icon={CreditCard}
          />
          <SummaryCard
            title="Economizado"
            value={stats.saved}
            icon={PiggyBank}
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
                Nenhuma despesa registrada neste período. 📊
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent transactions button */}
        {recentTransactions.length > 0 && (
          <Dialog open={isOpenTransactions} onOpenChange={setIsOpenTransactions}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
              >
                Ver Últimas Transações ({recentTransactions.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Histórico de Transações</DialogTitle>
                <DialogDescription>
                  Página {currentPage} de {totalPages}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 px-4">
                {/* Transactions list */}
                <ul className="divide-y divide-border" role="list" aria-label="Lista de transações">
                  {paginatedTransactions.map((tx, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {tx.category}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-destructive">
                          R$ {tx.amount.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(tx);
                          }}
                          className="h-7 px-2"
                        >
                          Ver
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  <span className="text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de detalhes da transação */}
        <AlertDialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTransaction?.category.split(" ")[0]}</span>
                <div>
                  <AlertDialogTitle>
                    {selectedTransaction?.category}
                  </AlertDialogTitle>
                  <AlertDialogDescription>{selectedTransaction?.date}</AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <div className="space-y-3 py-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Descrição</p>
                <p className="text-sm font-medium text-foreground mt-1">{selectedTransaction?.description}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Valor</p>
                <p className="text-lg font-bold text-destructive mt-1">R$ {selectedTransaction?.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <AlertDialogCancel className="flex-1">Fechar</AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
