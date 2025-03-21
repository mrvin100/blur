'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Permission } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user: {
    id?: string;
    userName?: string;
    permissions?: Permission[];
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(status === 'loading');
  }, [status]);

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.permissions?.some(
    (p: Permission) => p.name === 'canCreateUsers'
  ) ?? false;

  const value = {
    isAuthenticated,
    isLoading,
    isAdmin,
    user: session?.user ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the context for type usage
export type { AuthContextType };
export { AuthContext }; 