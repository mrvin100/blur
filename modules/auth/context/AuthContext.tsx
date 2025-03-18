'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);

      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/@admin');
      } else {
        router.push('/dashboard/@user');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 