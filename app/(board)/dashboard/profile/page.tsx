'use client';

import { useCurrentUser } from "@/hooks";
import { User, Mail, Shield, Calendar, Trophy, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const userName = user?.userName ?? "User";
  const userEmail = user?.email ?? "No email provided";
  const userImage = "";
  const userInitial = userName.charAt(0).toUpperCase();
  const isAdmin = user?.role === 'GREAT_ADMIN' || user?.roles?.includes('GREAT_ADMIN');
  const roleLabel = (user?.role ?? user?.roles?.[0] ?? 'RACER') as string;
  const permissions = user?.permissions ?? [];
  const createdAt = user?.createdAt;
  const updatedAt = user?.updatedAt;

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              Profile
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              View your account information
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 w-full">
          {/* User Info Card */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl sm:text-2xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-1">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">{userName}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    {userEmail}
                  </CardDescription>
                  <div className="pt-1">
                    <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                      {isAdmin ? "Administrator" : "User"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Account Details
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your account information and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="grid gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium">Username</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{userName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium">Email</span>
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">{userEmail}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium">Role</span>
                  <Badge variant="outline" className="text-xs w-fit">
                    {roleLabel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          {permissions.length > 0 && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                  Permissions
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your current access permissions</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta */}
          {(createdAt || updatedAt) && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Account Meta
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Informations techniques de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
                {createdAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-muted/50 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Created</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">{createdAt}</span>
                  </div>
                )}
                {updatedAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 bg-muted/50 rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">Updated</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">{updatedAt}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Stats
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your racing statistics overview</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">0</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Parties Joined</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold">0</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Races Completed</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold">0</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Total Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
