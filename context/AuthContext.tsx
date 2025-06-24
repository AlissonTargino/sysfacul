'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  nome: string;
  funcao: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
      } catch (error) {
        localStorage.removeItem('auth-token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decodedUser = jwtDecode<User>(token);
      setUser(decodedUser);
      localStorage.setItem('auth-token', token);
      router.push('/dashboard');
    } catch(error) {
      console.error("Erro ao decodificar token", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-token');
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};