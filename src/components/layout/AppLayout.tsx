import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  hideHeader?: boolean;
}

export function AppLayout({ children, title, subtitle, hideHeader }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      
      {!hideHeader && <Header title={title} subtitle={subtitle} />}
      
      <main 
        id="main-content" 
        className="flex-1 pb-20"
        role="main"
      >
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
