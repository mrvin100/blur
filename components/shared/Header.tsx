"use client";

import Link from "next/link";
import { useAuth } from "@/modules/auth/context";
import { Button } from "@/components/ui/button";
import { UserActions } from "./UserActions";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = isAuthenticated && !isLoading ? (
    isAdmin ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/users", label: "Users" },
      { href: "/dashboard/settings", label: "Settings" },
    ] : [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/history", label: "History" },
      { href: "/dashboard/settings", label: "Settings" },
    ]
  ) : [];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/" 
              className="text-lg sm:text-xl font-semibold text-foreground hover:text-accent-foreground transition-colors"
            >
              Blur
            </Link>

            {isAuthenticated && !isLoading && (
              <div className="hidden md:flex items-center gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-16 sm:w-20 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <div className="hidden sm:block">
                  <UserActions />
                </div>
                {/* Mobile menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="sm:hidden">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      {navLinks.map((link) => (
                        <Link 
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base py-2 text-muted-foreground hover:text-foreground transition-colors border-b border-border"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="pt-4">
                        <UserActions />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
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
