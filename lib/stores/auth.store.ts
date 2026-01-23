"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/lib/schemas/auth.schema";

interface AuthState {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isAdmin:
            user?.role === "GREAT_ADMIN" ||
            user?.permissions?.includes("VIEW_ALL_USERS") ||
            false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        }),

      hydrate: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isAdmin:
            user?.role === "GREAT_ADMIN" ||
            user?.permissions?.includes("VIEW_ALL_USERS") ||
            false,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

// Selector hooks for performance optimization
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
