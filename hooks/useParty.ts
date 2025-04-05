import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/app/(board)/dashboard/layout";
import { PartyManagementCacheKeys } from "./const";
import { getAllParties, getPartyById } from "@/app/services/partyService";

export const useParty = (partyId?: string) => {
  const fetchPartyById = useQuery({
    queryKey: [PartyManagementCacheKeys.Party, partyId],
    queryFn: () => getPartyById(partyId as string),
    enabled: !!partyId
  })
  
  const createParty = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/party', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to create party');
      }
      const data = await response.json();
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Parties],
      }),
  })
  
  const fetchAllParties = useQuery({
    queryKey: [PartyManagementCacheKeys.Parties],
    queryFn: () => getAllParties()
  })

  return { fetchPartyById, createParty, fetchAllParties }
}