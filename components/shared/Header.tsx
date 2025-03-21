"use client";

import Link from "next/link";
import { useAuth } from "@/modules/auth/context";
import { Button } from "@/components/ui/button";
import { UserActions } from "./UserActions";

export function Header() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-xl font-semibold text-foreground hover:text-accent-foreground transition-colors"
            >
              Blur
            </Link>

            {isAuthenticated && !isLoading && (
              <div className="hidden md:flex items-center gap-4">
                {isAdmin ? (
                  <>
                    <Link 
                      href="/admin/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  </>
                ) : (
                  <Link 
                    href="/dashboard"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <UserActions />
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
