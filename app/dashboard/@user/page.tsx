'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function UserDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome, {user?.userName}!</h2>
        </CardHeader>
        <CardContent>
          <p>Welcome to your personal dashboard. Here you can manage your account and view your data.</p>
        </CardContent>
      </Card>
    </div>
  );
} 