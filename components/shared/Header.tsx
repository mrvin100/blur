"use client";

import Link from "next/link";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Button } from "../ui/button";
import { UserActions } from "./UserActions";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-semibold text-foreground hover:text-accent-foreground transition-colors"
          >
            Blur
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
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
