import { useState } from "react";
import { useGoals } from "@/contexts/GoalsContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateGoalDialog() {
  const { addGoal } = useGoals();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  // Obter data de hoje no formato YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a meta",
        variant: "destructive",
      });
      return;
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido para a meta",
        variant: "destructive",
      });
      return;
    }

    if (hasDeadline && !formData.deadline) {
      toast({
        title: "Erro",
        description: "Escolha uma data para a meta",
        variant: "destructive",
      });
      return;
    }

    // Validar se a data não é no passado
    if (hasDeadline && formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast({
          title: "Erro",
          description: "A data não pode ser no passado",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setLoading(true);

      await addGoal({
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        deadline: hasDeadline ? formData.deadline : undefined,
        description: "",
      });

      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!",
      });

      setFormData({
        title: "",
        targetAmount: "",
        deadline: "",
      });
      setHasDeadline(true);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar meta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <Plus className="w-4 h-4 mr-1" />
          Nova meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar nova meta</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua nova meta financeira.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome da meta</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Viagem para o exterior"
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Valor alvo (R$)</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              placeholder="0,00"
              step="0.01"
              min="0"
              value={formData.targetAmount}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={hasDeadline ? "default" : "outline"}
                size="sm"
                onClick={() => setHasDeadline(true)}
                disabled={loading}
                className="flex-1"
              >
                Com prazo
              </Button>
              <Button
                type="button"
                variant={!hasDeadline ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setHasDeadline(false);
                  setFormData((prev) => ({ ...prev, deadline: "" }));
                }}
                disabled={loading}
                className="flex-1"
              >
                Sem prazo
              </Button>
            </div>

            {hasDeadline && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="deadline">Data estimada</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  disabled={loading}
                  min={getTodayString()}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Criando..." : "Criar meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
