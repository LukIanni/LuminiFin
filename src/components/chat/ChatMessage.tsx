import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Sparkles, User } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  category?: string;
  amount?: number;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 chat-bubble-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      role="article"
      aria-label={isUser ? "Sua mensagem" : "Resposta do assistente"}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "gradient-primary text-primary-foreground shadow-glow"
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Message bubble */}
      <Card
        variant={isUser ? "chat" : "chat-primary"}
        className={cn(
          "max-w-[80%] px-4 py-3",
          isUser ? "rounded-tr-md" : "rounded-tl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        {/* Category badge */}
        {message.category && (
          <div className="mt-2 flex items-center gap-2">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              isUser 
                ? "bg-background/50 text-foreground"
                : "bg-primary-foreground/20 text-primary-foreground"
            )}>
              {message.category}
            </span>
            {message.amount && (
              <span className={cn(
                "text-xs font-semibold",
                isUser ? "text-foreground" : "text-primary-foreground"
              )}>
                R$ {message.amount.toFixed(2)}
              </span>
            )}
          </div>
        )}
        
        {/* Timestamp */}
        <time
          className={cn(
            "text-[10px] mt-1 block opacity-70",
            isUser ? "text-right" : "text-left"
          )}
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </Card>
    </div>
  );
}
