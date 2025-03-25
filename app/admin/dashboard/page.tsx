'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    } else if (session?.user && !session.user.permissions.some(p => p.name === 'canCreateUsers')) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => router.push('/admin/users')}
              >
                Manage Users
              </Button>
              <Button 
                className="w-full" 
                onClick={() => router.push('/admin/tournaments')}
              >
                Manage Tournaments
              </Button>
              <Button 
                className="w-full" 
                onClick={() => router.push('/admin/schedule')}
              >
                Manage Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">System Status</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Active Users: 0</p>
              <p>Active Tournaments: 0</p>
              <p>System Health: Good</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>No recent activity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 