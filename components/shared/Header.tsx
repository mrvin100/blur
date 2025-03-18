"use client";

import Link from "next/link";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Button } from "../ui/button";

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Button asChild variant={"link"}>
              <Link href="/">Blur</Link>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild variant={"link"}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={() => logout()}>Logout</Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button className="cursor-pointer">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
