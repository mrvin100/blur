"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AuthUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user as AuthUser | null;

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/sign-in");
      return;
    }
  }, [isPending, user, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <SidebarProvider className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-2 border-b px-4 py-2">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold text-muted-foreground">
            Blur Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto px-4 py-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
