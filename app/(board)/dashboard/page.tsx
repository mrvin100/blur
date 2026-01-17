'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Flag, Users, Star, Plus, History, Car, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParties, useUsers } from '@/hooks';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: parties } = useParties();
  
  // Check if user is admin
  const isAdmin = session?.user?.permissions?.some((p) => p === 'VIEW_ALL_USERS');
  
  // Only fetch users if admin
  const { data: users } = useUsers(isAdmin);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const userName = session?.user?.name ?? session?.user?.userName ?? 'User';
  const totalParties = parties?.length || 0;
  const totalUsers = isAdmin ? (users?.length || 0) : 0;
  const totalRaces = parties?.reduce((acc, party) => acc + (party.racesPlayed?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {userName}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your racing world
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/party/new">
            <Plus className="h-4 w-4 mr-2" />
            New Party
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={`grid gap-3 sm:gap-4 grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Parties</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalParties}</div>
            <p className="text-xs text-muted-foreground">Racing events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Races</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalRaces}</div>
            <p className="text-xs text-muted-foreground">Races completed</p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Racers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Your Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">#1</div>
            <p className="text-xs text-muted-foreground">Keep racing!</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : ''}`}>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/party/new')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Plus className="h-5 w-5 text-primary" />
              Start New Party
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create a new racing party and invite your friends
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/history')}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <History className="h-5 w-5 text-primary" />
              View History
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Check past races, scores, and statistics
            </CardDescription>
          </CardHeader>
        </Card>

        {isAdmin && (
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer sm:col-span-2 lg:col-span-1" onClick={() => router.push('/dashboard/users')}>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-5 w-5 text-primary" />
                Manage Users
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Add, edit or manage racing participants
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Your latest racing activities</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {totalParties === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base font-medium">No activity yet</p>
              <p className="text-xs sm:text-sm mt-1">Start your first party to see activity here!</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/party/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Party
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have participated in {totalParties} {totalParties === 1 ? 'party' : 'parties'} 
                with a total of {totalRaces} {totalRaces === 1 ? 'race' : 'races'}.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/history">
                  View Full History
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 