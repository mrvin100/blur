"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/modules/shared/components/Sidebar";
import { adminNavigationItems } from "@/modules/admin/config/navigation";
import { userNavigationItems } from "@/modules/user/config/navigation";

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
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const isAdmin = session?.user?.permissions?.some(p => p.name === 'canCreateUsers');
  const navigationItems = isAdmin ? adminNavigationItems : userNavigationItems;

  return (
    <div className="flex min-h-screen">
      <AppSidebar items={navigationItems} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
