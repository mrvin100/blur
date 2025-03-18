'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </CardHeader>
        <CardContent>
          <p>Welcome to the admin dashboard. Here you can manage users and system settings.</p>
        </CardContent>
      </Card>
    </div>
  );
} 