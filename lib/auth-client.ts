"use client";

import { createAuthClient } from "better-auth/react";
import type { AuthUser } from "./auth";

// Create the auth client for React components
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

// Export hooks and utilities
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;

// Type for session with our custom user
export type ClientSession = {
  user: AuthUser | null;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  } | null;
};

// Helper to check if user is admin
export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.role === "GREAT_ADMIN" ||
    user.permissions?.includes("VIEW_ALL_USERS") ||
    false
  );
}

// Helper to get access token from session
export function getAccessToken(session: ClientSession | null): string | null {
  return session?.user?.accessToken ?? null;
}
