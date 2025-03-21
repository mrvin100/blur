'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    // Redirect to the appropriate slot based on role
    const role = isAdmin() ? 'admin' : 'user';
    router.push(`/dashboard/@${role}`);
  }, [isAuthenticated, isAdmin, router]);

  return null;
} 