'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    } else if (session?.user) {
      const isAdmin = session.user.permissions.some(p => p.name === 'canCreateUsers');
      // The layout will handle showing the appropriate dashboard
      // We just need to ensure we're on the correct route
      if (isAdmin && !window.location.pathname.includes('/dashboard/admin')) {
        router.push('/dashboard/admin');
      } else if (!isAdmin && !window.location.pathname.includes('/dashboard/user')) {
        router.push('/dashboard/user');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return null;
} 