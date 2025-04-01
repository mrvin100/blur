"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/modules/shared/components/Sidebar";
import { adminNavigationItems } from "@/modules/admin/config/navigation";
import { userNavigationItems } from "@/modules/user/config/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin = session.user.permissions?.some(
        (p) => p.name === "canCreateUsers"
      );
      // The layout will handle showing the appropriate dashboard
      // We just need to ensure we're on the correct route
      if (isAdmin && !window.location.pathname.includes("/dashboard")) {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const isAdmin = session?.user?.permissions?.some(
    (p) => p.name === "canCreateUsers"
  );
  const navigationItems = isAdmin ? adminNavigationItems : userNavigationItems;
  const userName = session?.user?.name ?? session?.user?.userName ?? "User"

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar navigationItems={navigationItems} />
        <div className="flex-1 flex flex-col h-screen">
          <header className="border-b p-4 flex items-center justify-between bg-background">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <SidebarTrigger>
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle sidebar</span>
                </SidebarTrigger>
              </Button>
              <h1 className="text-xl font-semibold">Board</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {userName}
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
