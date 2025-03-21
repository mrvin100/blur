'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { User, AuthContextType } from '@/types';

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
      const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.session));
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
      const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.login), {
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

      // Redirect to the appropriate slot based on role
      const role = data.user?.role.toLowerCase();
      router.push(`/dashboard/@${role}`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.endpoints.auth.logout), {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      setIsAuthenticated(false);
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    return user?.role.toLowerCase() === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isAdmin }}>
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