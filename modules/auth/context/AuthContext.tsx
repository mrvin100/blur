'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user: {
    id?: string;
    userName?: string;
    role?: string;
    permissions?: string[];
    accessToken?: string;
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
  const isAdmin = session?.user?.role === 'GREAT_ADMIN' || session?.user?.permissions?.includes('VIEW_ALL_USERS') || false;

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