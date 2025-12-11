import { MessageCircle, Target, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/",
    icon: MessageCircle,
    label: "Chat",
    ariaLabel: "Ir para o chat financeiro",
  },
  {
    to: "/metas",
    icon: Target,
    label: "Metas",
    ariaLabel: "Ir para suas metas financeiras",
  },
  {
    to: "/relatorios",
    icon: BarChart3,
    label: "Relatórios",
    ariaLabel: "Ver relatórios financeiros",
  },
];

export function BottomNav() {
  return (
    <nav
      role="navigation"
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-soft"
    >
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.ariaLabel}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
