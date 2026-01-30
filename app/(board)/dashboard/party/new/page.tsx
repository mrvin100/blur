'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy route.
 * Party creation is automatic via /dashboard/party (today's party).
 */
export default function NewPartyRoutePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/party');
  }, [router]);

  return null;
}
