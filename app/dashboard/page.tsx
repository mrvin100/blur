'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">User Dashboard</h1>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Welcome, {session?.user?.userName}!</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Your Permissions:</h3>
              <ul className="list-disc list-inside mt-2">
                {session?.user?.permissions.map((permission: { id: number; name: string }) => (
                  <li key={permission.id}>{permission.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 