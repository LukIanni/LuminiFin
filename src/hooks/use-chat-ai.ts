import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api";
import { formatarMensagemErro } from "@/lib/erro-messages";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  category?: string;
  amount?: number;
}

interface ClassificationResult {
  texto_chat: string;
  valor: number;
  categoria: string;
  icone: string;
}

export function useChatAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdRef = useRef(0);

  const generateId = () => {
    messageIdRef.current += 1;
    return `msg-${messageIdRef.current}`;
  };

  const addMessage = useCallback(
    (content: string, role: "user" | "assistant", category?: string, amount?: number) => {
      const newMessage: Message = {
        id: generateId(),
        content,
        role,
        timestamp: new Date(),
        category,
        amount,
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    []
  );

  const classifyExpense = useCallback(
    async (userInput: string) => {
      try {
        setLoading(true);
        setError(null);

        // Adicionar mensagem do usuário
        addMessage(userInput, "user");

        // Enviar para a API
        const response = await apiClient.post<{ success: boolean; data: ClassificationResult }>(
          "/ai/classify-expense",
          { description: userInput }
        );

        if (!response.data.success) {
          throw new Error("Erro ao classificar gasto");
        }

        const classification = response.data.data;

        // Adicionar resposta do assistente com classificação
        addMessage(
          classification.texto_chat,
          "assistant",
          classification.categoria,
          classification.valor
        );

        return classification;
      } catch (err: any) {
        const mensagemErro = formatarMensagemErro(err);
        setError(mensagemErro);
        // Adicionar mensagem de erro amigável no chat
        addMessage(mensagemErro, "assistant");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addMessage]
  );

  const sendMessage = useCallback(
    async (userInput: string) => {
      try {
        setLoading(true);
        setError(null);

        // Adicionar mensagem do usuário
        addMessage(userInput, "user");

        // Enviar para a API
        const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
          "/ai/chat",
          {
            message: userInput,
            history: messages.map((m) => ({
              role: m.role,
              parts: [{ text: m.content }],
            })),
          }
        );

        if (!response.data.success) {
          throw new Error("Erro ao enviar mensagem");
        }

        // Adicionar resposta do assistente
        addMessage(response.data.data.message, "assistant");

        return response.data.data.message;
      } catch (err: any) {
        const mensagemErro = formatarMensagemErro(err);
        setError(mensagemErro);
        // Adicionar mensagem de erro amigável no chat
        addMessage(mensagemErro, "assistant");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messages, addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    messageIdRef.current = 0;
  }, []);

  return {
    messages,
    loading,
    error,
    classifyExpense,
    sendMessage,
    addMessage,
    clearMessages,
  };
}
