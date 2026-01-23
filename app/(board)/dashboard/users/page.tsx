"use client";

import { useSession } from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth";
import { Users } from "@/modules/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as AuthUser | null;
  const isAdmin = user?.permissions?.some((p) => p === "VIEW_ALL_USERS");

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10 w-fit">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Users />
    </div>
  );
}
