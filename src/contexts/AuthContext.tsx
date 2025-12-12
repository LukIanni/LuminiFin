import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, User, AuthResponse } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, name: string) => Promise<AuthResponse>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const profile = await apiClient.getProfile();
          setUser(profile);
        }
      } catch (err) {
        apiClient.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await apiClient.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao fazer login";
      setError(message);
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const response = await apiClient.signup({ email, password, name });
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao cadastrar";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
