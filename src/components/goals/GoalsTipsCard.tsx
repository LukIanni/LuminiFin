import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoals } from "@/contexts/GoalsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGoalsTips } from "@/hooks/use-goals-tips";

export function GoalsTipsCard() {
  const { goals } = useGoals();
  const { user } = useAuth();
  const { dicas, currentPage, totalPages, loading, error, generateTips, nextPage, prevPage, goToPage, getCurrentDica } = useGoalsTips();
  const [tipGenerated, setTipGenerated] = useState(false);

  // Gerar dicas apenas uma vez quando goals muda e há metas
  useEffect(() => {
    if (goals.length > 0 && !tipGenerated && !loading) {
      console.log("🎯 Gerando dicas para", goals.length, "metas");
      generateTips(goals, user?.name).catch(err => console.error("Erro ao gerar dicas:", err));
      setTipGenerated(true);
    }
  }, [goals.length, user?.name, tipGenerated, loading, generateTips]);

  const handleGenerateTips = async () => {
    try {
      setTipGenerated(false); // Reset para permitir regeneração
      await generateTips(goals, user?.name);
      setTipGenerated(true);
    } catch (err) {
      console.error("Erro ao gerar dicas manualmente:", err);
    }
  };

  const currentDica = getCurrentDica();

  if (goals.length === 0) {
    return (
      <Card className="animate-slide-up">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Crie uma meta para receber dicas personalizadas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Dicas Inteligentes</h3>
          </div>
          <Button
            onClick={handleGenerateTips}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? "Carregando..." : "Atualizar"}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {dicas.length > 0 && currentDica && (
          <div className="space-y-4">
            {/* Dica atual */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 min-h-24 flex items-center justify-center">
              <p className="text-center text-sm leading-relaxed font-medium">
                {currentDica}
              </p>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0 || loading}
                size="sm"
                variant="ghost"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
                
                {/* Indicadores de página */}
                <div className="flex gap-1 ml-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPage(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentPage
                          ? "bg-primary w-6"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Ir para dica ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1 || loading}
                size="sm"
                variant="ghost"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {dicas.length === 0 && !loading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Clique em Atualizar para gerar dicas personalizadas
            </p>
            <Button onClick={handleGenerateTips} disabled={loading} size="sm">
              Gerar Dicas 💡
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
