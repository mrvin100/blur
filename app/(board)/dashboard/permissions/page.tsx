"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, AlertCircle, Users, Lock, ShieldAlert, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PermissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAdmin = session?.user?.permissions?.some((p) => p === "VIEW_ALL_USERS");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="w-full">
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
    <div className="w-full">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              Permissions Management
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage user roles and permissions
            </p>
          </div>
        </div>

        <Alert className="text-xs sm:text-sm">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertDescription className="ml-2">
            Permission management is configured through user roles. Assign roles when creating or editing users.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                GREAT_ADMIN
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Full system access</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ All user management</li>
                <li>✓ All party management</li>
                <li>✓ All race management</li>
                <li>✓ View all statistics</li>
                <li>✓ System configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                PARTY_MANAGER
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Party and race management</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ Create/manage parties</li>
                <li>✓ Create/start races</li>
                <li>✓ Add participants</li>
                <li>✓ Submit scores</li>
                <li>✓ View history</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                RACER
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Basic racing access</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>✓ View own parties</li>
                <li>✓ View own races</li>
                <li>✓ View own scores</li>
                <li>✓ View history</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-sm sm:text-base md:text-lg">How to Manage Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
            <div>
              <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Assigning Roles</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Navigate to the <strong>Users</strong> page and create or edit a user. 
                Select the appropriate role from the dropdown menu.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">Role Hierarchy</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                GREAT_ADMIN → PARTY_MANAGER → RACER
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
