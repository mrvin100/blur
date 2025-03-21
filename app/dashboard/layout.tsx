'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  admin: React.ReactNode;
  user: React.ReactNode;
}

export default function DashboardLayout({ admin, user }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const isAdmin = session?.user?.permissions?.some(p => p.name === 'canCreateUsers');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAdmin ? admin : user}
      </main>
    </div>
  );
} 