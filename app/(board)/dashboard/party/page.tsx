'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTodayParty } from '@/hooks';
import { PageLoader } from '@/components/ui/page-loader';
import { ApiErrorState } from '@/components/ui/error-states';

/**
 * /dashboard/party
 * New rule: a racer should always land on today's party.
 * Backend creates the party if it doesn't exist.
 */
export default function PartyPage() {
  const router = useRouter();
  const { data: party, isLoading, isError, error } = useTodayParty();

  useEffect(() => {
    if (party?.id) {
      router.replace(`/dashboard/party/${party.id}`);
    }
  }, [party?.id, router]);

  if (isLoading) {
    return <PageLoader message="Chargement de la partie du jour..." />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-10">
        <ApiErrorState error={error ?? new Error('Failed to load today party')} />
      </div>
    );
  }

  return <PageLoader message="Redirection..." />;
}
