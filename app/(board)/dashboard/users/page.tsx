"use client";

import { useSession } from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth";
import { LazyUsers } from "@/lib/lazy-modules";
import { TableSkeleton } from "@/components/ui/page-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as AuthUser | null;
  const isAdmin = user?.permissions?.some((p) => p === "VIEW_ALL_USERS");

  if (isPending) {
    return <TableSkeleton rows={8} />;
  }

  if (!isAdmin) {
    return (
      <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10 w-fit">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Accès Refusé</CardTitle>
            <CardDescription>
              Vous n&apos;avez pas la permission d&apos;accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Retour au Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
    );
  }

  return <LazyUsers />;
}
