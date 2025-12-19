import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpensesContext";
import { useChatAI } from "@/hooks/use-chat-ai";
import { toast } from "sonner";

// Initial welcome message
const getInitialMessages = (userName: string): Message[] => [
  {
    id: "1",
    content: `Olá ${userName}! 👋 Sou seu assistente financeiro. Me conte seus gastos de forma natural que eu organizo tudo pra você. Por exemplo: 'Gastei 50 reais no mercado' ou 'Almocei por 25'.`,
    role: "assistant",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function Index() {
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const { messages: aiMessages, loading, classifyExpense } = useChatAI();
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar com mensagem de boas-vindas
  useEffect(() => {
    if (user?.name && !initialized) {
      setDisplayMessages(getInitialMessages(user.name));
      setInitialized(true);
    }
  }, [user?.name, initialized]);

  // Sincronizar novas mensagens da IA
  useEffect(() => {
    // Sempre usar as mensagens da IA como fonte da verdade
    if (aiMessages.length > 0) {
      const allMessages: Message[] = [
        ...getInitialMessages(user?.name || "Usuário"),
        ...aiMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      ];
      setDisplayMessages(allMessages);
    }
  }, [aiMessages, user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleSend = async (content: string) => {
    setIsTyping(true);
    try {
      const result = await classifyExpense(content);
      
      // Se houve um gasto detectado, adiciona ao banco
      if (result && result.valor > 0) {
        try {
          await addExpense({
            amount: result.valor,
            category: result.categoria,
            description: content,
            date: new Date().toISOString().split("T")[0],
          });
          toast.success("Despesa registrada com sucesso!");
        } catch (err) {
          console.error("Erro ao registrar despesa:", err);
        }
      }
    } catch (err) {
      console.error("Erro ao processar gasto:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppLayout subtitle="Seu assistente financeiro">
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div 
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          role="log"
          aria-live="polite"
          aria-label="Histórico de mensagens"
        >
          {displayMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {(isTyping || loading) && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-soft" />
              </div>
              <div className="bg-secondary/50 px-4 py-3 rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSend} disabled={isTyping || loading} />
      </div>
    </AppLayout>
  );
}
