'use client';

import { useSession } from "@/lib/auth-client";
import type { AuthUser } from "@/lib/auth";
import type { User } from "@/types/user.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Flag, Users, Star, Plus, History } from "lucide-react";
import Link from "next/link";
import { useParties, useUsers } from "@/hooks";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: parties } = useParties();
  const user = session?.user as AuthUser | null;
  const isAdmin = user?.permissions?.some((p) => p === "VIEW_ALL_USERS");
  const { data: users } = useUsers(isAdmin) as { data: User[] | undefined };

  const userName = user?.name ?? "User";
  const activeParties = parties?.length ?? 0;
  const totalRaces = parties?.reduce((sum, p) => sum + (p.racesPlayed?.length ?? 0), 0) ?? 0;
  const totalUsers = users?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Manage your racing platform from here." : "Track your racing progress and compete with others."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Parties</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeParties}</div>
            <p className="text-xs text-muted-foreground">Racing events in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRaces}</div>
            <p className="text-xs text-muted-foreground">Races completed so far</p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered racers</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isAdmin ? "Admin" : "Racer"}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Full access privileges" : "Standard access"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Parties
            </CardTitle>
            <CardDescription>
              {isAdmin ? "Create and manage racing parties" : "Join and participate in parties"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/party/new">
                <Plus className="mr-2 h-4 w-4" />
                {isAdmin ? "Create New Party" : "View Parties"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              History
            </CardTitle>
            <CardDescription>View your racing history and past performances</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/history">View History</Link>
            </Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
              <CardDescription>Manage registered users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/dashboard/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Parties */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parties</CardTitle>
          <CardDescription>Latest racing events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {parties && parties.length > 0 ? (
            <div className="space-y-2">
              {parties.slice(0, 5).map((party) => (
                <div
                  key={party.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">Party #{party.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {party.datePlayed ? new Date(party.datePlayed).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/party/${party.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No parties found. {isAdmin ? "Create your first party to get started!" : "Ask an admin to create a party."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
