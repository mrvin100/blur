"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/modules/shared/components/Sidebar";
import { adminNavigationItems } from "@/modules/admin/config/navigation";
import { userNavigationItems } from "@/modules/user/config/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin = session.user.permissions?.some(p => p.name === 'canCreateUsers');
      // The layout will handle showing the appropriate dashboard
      // We just need to ensure we're on the correct route
      if (isAdmin && !window.location.pathname.includes('/dashboard')) {
        router.push('/dashboard');
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const isAdmin = session?.user?.permissions?.some(p => p.name === 'canCreateUsers');
  const navigationItems = isAdmin ? adminNavigationItems : userNavigationItems;

  return (
    <div className="flex h-screen">
      <AppSidebar navigationItems={navigationItems} />
      <main className="flex-1 overflow-y-auto">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </main>
    </div>
  );
}
