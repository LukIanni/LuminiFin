import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Digite seu gasto..." }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-20 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-3"
      role="form"
      aria-label="Enviar mensagem"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            variant="chat"
            inputSize="lg"
            disabled={disabled}
            aria-label="Campo de mensagem"
            className="pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Entrada por voz"
            disabled={disabled}
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          type="submit"
          variant="chat"
          size="icon-lg"
          disabled={!input.trim() || disabled}
          aria-label="Enviar mensagem"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-2">
        Ex: "Gastei 45 reais no mercado" ou "Almocei por 25"
      </p>
    </form>
  );
}
