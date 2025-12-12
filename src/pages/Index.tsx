import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpensesContext";
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

function generateResponse(userMessage: string): { message: Message; expense?: { category: string; amount: number; description: string } } {
  // Simple expense parser
  const expensePatterns = [
    { regex: /(\d+(?:[.,]\d{2})?)\s*(?:reais?|r\$)?\s*(?:no|na|em|de)?\s*(mercado|supermercado)/i, category: "🛒 Mercado" },
    { regex: /(\d+(?:[.,]\d{2})?)\s*(?:reais?|r\$)?\s*(?:no|na|em|de)?\s*(almo[çc]o|jantar|lanche|comida|restaurante)/i, category: "🍽️ Alimentação" },
    { regex: /(\d+(?:[.,]\d{2})?)\s*(?:reais?|r\$)?\s*(?:no|na|em|de)?\s*(uber|99|táxi|taxi|transporte|ônibus|metrô)/i, category: "🚗 Transporte" },
    { regex: /(\d+(?:[.,]\d{2})?)\s*(?:reais?|r\$)?\s*(?:no|na|em|de)?\s*(farmácia|farm[aá]cia|remédio|remedio)/i, category: "💊 Saúde" },
    { regex: /(gastei|paguei|comprei)\s*(?:r\$|reais?)?\s*(\d+(?:[.,]\d{2})?)/i, category: "📝 Outros" },
  ];

  for (const { regex, category } of expensePatterns) {
    const match = userMessage.match(regex);
    if (match) {
      const amountStr = match[1] || match[2];
      const amount = parseFloat(amountStr.replace(",", "."));
      if (amount > 0) {
        const tips = [
          `✨ Dica: Tente levar marmita para economizar em alimentação!`,
          `💡 Que tal criar uma meta de economia este mês?`,
          `📊 Acompanhe seus relatórios para ver onde pode economizar.`,
          `🎯 Você está no caminho certo! Continue registrando seus gastos.`,
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        return {
          message: {
            id: Date.now().toString(),
            content: `Registrei: ${category} no valor de R$ ${amount.toFixed(2)}. ${randomTip}`,
            role: "assistant",
            timestamp: new Date(),
            category,
            amount,
          },
          expense: {
            category: category.replace(/^[🛒🍽️🚗💊📝]\s/, ""),
            amount,
            description: userMessage,
          },
        };
      }
    }
  }

  const responses = [
    "Não consegui identificar o valor. Pode me dizer novamente? Ex: 'Gastei 50 no mercado'",
    "Me conta o valor e onde foi o gasto que eu registro pra você! 📝",
    "Tente algo como: 'Almocei por 25' ou 'Uber 18 reais'",
  ];

  return {
    message: {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      role: "assistant",
      timestamp: new Date(),
    },
  };
}

export default function Index() {
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.name) {
      setMessages(getInitialMessages(user.name));
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setTimeout(async () => {
      const { message, expense } = generateResponse(content);
      setMessages((prev) => [...prev, message]);
      
      // Se houve um gasto detectado, adiciona ao banco
      if (expense) {
        try {
          await addExpense({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: new Date().toISOString().split("T")[0],
          });
          toast.success("Despesa registrada com sucesso!");
        } catch (err) {
          toast.error("Erro ao registrar despesa");
        }
      }
      
      setIsTyping(false);
    }, 800 + Math.random() * 500);
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
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
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

        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </AppLayout>
  );
}
