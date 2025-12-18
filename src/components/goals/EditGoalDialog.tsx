import { useState, useEffect } from "react";
import { useGoals } from "@/contexts/GoalsContext";
import { Goal } from "./GoalCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGoalDialog({ goal, open, onOpenChange }: EditGoalDialogProps) {
  const { updateGoal, deleteGoal } = useGoals();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(!!goal?.deadline);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingTargetAmount, setEditingTargetAmount] = useState(false);
  const [formData, setFormData] = useState({
    title: goal?.title || "",
    targetAmount: goal?.targetAmount.toString() || "",
    currentAmount: goal?.currentAmount.toString() || "",
    deadline: goal?.deadline instanceof Date ? goal.deadline.toISOString().split("T")[0] : (goal?.deadline || ""),
  });

  // Obter data de hoje no formato YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Atualizar formData quando o goal muda
  useEffect(() => {
    if (goal) {
      let deadlineValue = "";
      if (goal.deadline) {
        if (goal.deadline instanceof Date) {
          deadlineValue = goal.deadline.toISOString().split("T")[0];
        } else {
          deadlineValue = goal.deadline.toString().split("T")[0];
        }
      }
      setFormData({
        title: goal.title || "",
        targetAmount: goal.targetAmount?.toString() || "",
        currentAmount: goal.currentAmount?.toString() || "",
        deadline: deadlineValue,
      });
      setHasDeadline(!!goal.deadline);
      setEditingTitle(false);
      setEditingTargetAmount(false);
    }
  }, [goal, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goal?.id) return;

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

      const updateData: any = {
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
      };

      // Apenas incluir deadline se hasDeadline for true e tiver um valor
      if (hasDeadline && formData.deadline) {
        updateData.deadline = formData.deadline;
      }

      await updateGoal(goal.id, updateData);

      toast({
        title: "Sucesso",
        description: "Meta atualizada com sucesso!",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar meta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!goal?.id) return;

    try {
      setLoading(true);
      await deleteGoal(goal.id);

      toast({
        title: "Sucesso",
        description: "Meta deletada com sucesso!",
      });

      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar meta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar meta</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da sua meta financeira.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome da meta - Modo renomeação */}
            <div className="space-y-2">
              <Label>Nome da meta</Label>
              {editingTitle ? (
                <div className="flex gap-2">
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    disabled={loading}
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingTitle(false)}
                    disabled={loading}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        title: goal?.title || "",
                      }));
                      setEditingTitle(false);
                    }}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-md border border-input bg-background">
                  <span className="flex-1 text-foreground">{formData.title}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTitle(true)}
                    disabled={loading}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Valor atual (R$)</Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Valor alvo - Modo renomeação */}
              <div className="space-y-2">
                <Label>Valor alvo (R$)</Label>
                {editingTargetAmount ? (
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetAmount: e.target.value,
                        }))
                      }
                      disabled={loading}
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingTargetAmount(false)}
                      disabled={loading}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          targetAmount: goal?.targetAmount.toString() || "",
                        }));
                        setEditingTargetAmount(false);
                      }}
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-md border border-input bg-background">
                    <span className="flex-1 text-foreground">
                      R$ {parseFloat(formData.targetAmount).toLocaleString("pt-BR")}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingTargetAmount(true)}
                      disabled={loading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
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
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar a meta "{goal?.title}". Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
