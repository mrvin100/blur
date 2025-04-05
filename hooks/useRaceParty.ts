import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys } from "./const"
import { queryClient } from "@/app/(board)/dashboard/layout"
import { getRacesByPartyId as getRacesByPartyIdService } from "@/app/services/raceService"

export const useRaceParty = (partyId: string) => {
  const fetchRaceByPartyId = useQuery({
    queryKey: [RaceCacheKeys.Race, partyId],
    queryFn: () => getRacesByPartyIdService(partyId),
    enabled: !!partyId
  })

  const createRace = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/race?partyId=${partyId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create race');
      }
      
      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RaceCacheKeys.Race]
      })
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party]
      })
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Parties]
      })
    }
  })
  
  return { fetchRaceByPartyId, createRace }
}