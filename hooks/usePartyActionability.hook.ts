import { useMemo } from 'react';
import { usePartyActiveStatus } from './useParties.hook';

/**
 * Utility hook to centralize the "party is actionable" rule across the frontend.
 *
 * A party is actionable only when the backend says it is actionable.
 */
export function usePartyActionability(partyId: number | string) {
  const query = usePartyActiveStatus(partyId);

  const isActionable = useMemo(() => {
    return query.data?.actionable ?? false;
  }, [query.data?.actionable]);

  return {
    ...query,
    isActionable,
    reason: query.data?.reason,
  };
}
