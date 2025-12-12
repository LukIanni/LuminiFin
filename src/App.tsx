import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ExpensesProvider } from "@/contexts/ExpensesContext";
import { GoalsProvider } from "@/contexts/GoalsContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Metas from "./pages/Metas";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ExpensesProvider>
          <GoalsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Index />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/metas" 
                  element={
                    <PrivateRoute>
                      <Metas />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/relatorios" 
                  element={
                    <PrivateRoute>
                      <Relatorios />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </GoalsProvider>
        </ExpensesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
