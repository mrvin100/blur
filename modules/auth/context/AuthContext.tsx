'use client';

import { createContext, useContext, useEffect } from 'react';
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
  const { setUser, setLoading, user, isAuthenticated, isAdmin, isLoading } = useAuthStore();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  useEffect(() => {
    if (!isPending) {
      const sessionUser = session?.user as AuthUser | null;
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          image: sessionUser.image,
          role: sessionUser.role,
          permissions: sessionUser.permissions,
          accessToken: sessionUser.accessToken,
          refreshToken: sessionUser.refreshToken,
        });
      } else {
        setUser(null);
      }
    }
  }, [session, isPending, setUser]);

  const value = {
    isAuthenticated,
    isLoading,
    isAdmin,
    user,
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