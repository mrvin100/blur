'use client';

import { createContext, useContext } from 'react';
import { useSession } from '@/lib/auth-client';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { AuthUser } from '@/lib/schemas/auth.schema';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const { user, isAuthenticated, isAdmin } = useAuthStore();

  // Use session user if available, otherwise fall back to store user
  const currentUser = session?.user ?? user;
  const currentIsAuthenticated = !!currentUser || isAuthenticated;
  const currentIsAdmin = currentUser?.role === "GREAT_ADMIN" || 
                         currentUser?.permissions?.includes("VIEW_ALL_USERS") || 
                         isAdmin;

  const value: AuthContextType = {
    isAuthenticated: currentIsAuthenticated,
    isLoading: isPending,
    isAdmin: currentIsAdmin,
    user: currentUser as AuthUser | null,
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