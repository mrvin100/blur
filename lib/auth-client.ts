"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { AuthUser } from "@/lib/schemas/auth.schema";

// Lightweight client-side session utilities backed by Zustand store
export type ClientSession = {
  user: AuthUser | null;
  session: null;
};

/**
 * Hook to detect Zustand persist rehydration
 * Uses multiple strategies to ensure we catch hydration completion
 */
function useHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Strategy 1: Check if persist API is available and use it
    const persistApi = useAuthStore.persist;
    
    if (persistApi && typeof persistApi.onFinishHydration === 'function') {
      // Check if already hydrated
      if (persistApi.hasHydrated && persistApi.hasHydrated()) {
        setHasHydrated(true);
        return;
      }
      
      // Subscribe to finish hydration event
      const unsubscribe = persistApi.onFinishHydration(() => {
        setHasHydrated(true);
      });
      
      return () => {
        unsubscribe();
      };
    } else {
      // Strategy 2: Fallback - wait for next tick to ensure React has rendered
      // This handles cases where persist API isn't available or store hydrates synchronously
      const timeoutId = setTimeout(() => {
        setHasHydrated(true);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return hasHydrated;
}

export function useSession(): { data: ClientSession | null; isPending: boolean } {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useHasHydrated();

  const data = useMemo<ClientSession | null>(() => ({ user, session: null }), [user]);
  
  // isPending is true only while waiting for hydration
  return { data, isPending: !hasHydrated };
}

export async function getSession(): Promise<{ data: ClientSession | null }> {
  // Client-side helper for API client hooks. Reads from localStorage persisted store.
  try {
    const raw = globalThis.localStorage?.getItem("auth-storage");
    if (!raw) return { data: null };
    const parsed = JSON.parse(raw);
    const user: AuthUser | null = parsed?.state?.user ?? null;
    return { data: user ? { user, session: null } : null } as { data: ClientSession | null };
  } catch {
    return { data: null } as { data: ClientSession | null };
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/session/logout", { method: "POST" });
  } catch {}
  useAuthStore.getState().logout();
}

// Helper to check if user is admin
export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.role === "GREAT_ADMIN" || user.permissions?.includes("VIEW_ALL_USERS") || false
  );
}

// Helper to get access token from session
export function getAccessToken(session: ClientSession | null): string | null {
  return session?.user?.accessToken ?? null;
}
