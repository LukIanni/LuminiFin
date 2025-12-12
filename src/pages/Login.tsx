import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return;
    }

    if (!formData.password) {
      setError("Senha é obrigatória");
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(authError || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LuminiFin</h1>
          </div>
          <p className="text-muted-foreground text-sm">Seu assistente financeiro inteligente</p>
        </div>

        {/* Card */}
        <Card className="p-8 border-none shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Bem-vindo de volta</h2>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar sua conta
            </p>
          </div>

          {/* Erros */}
          {(error || authError) && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive text-sm">
                {error || authError}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="h-11"
                autoComplete="email"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="h-11"
                autoComplete="current-password"
              />
            </div>

            {/* Botão */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-medium mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-secondary">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Demo:</strong> Teste com qualquer email e senha (mín. 6 caracteres)
          </p>
        </div>
      </div>
    </div>
  );
}
