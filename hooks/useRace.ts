import { queryClient } from "@/app/(board)/dashboard/layout"
import { Racer } from "@/types/party.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys } from "./const"
import { getRaceById as getRaceByIdService } from "@/app/services/raceService"

export const useRace = (raceId?: string) => {
  const updateRace = useMutation({
    mutationFn: async ({ selectedRacers, raceId }: { selectedRacers: Racer[]; raceId: string }) => {
      const response = await fetch(`/api/race?raceId=${raceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRacers)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update race');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party]
      })
      queryClient.invalidateQueries({
        queryKey: [RaceCacheKeys.Race]
      })
    },
  })
  
  const fetchRaceById = useQuery({
    queryKey: [RaceCacheKeys.Race, raceId],
    queryFn: () => getRaceByIdService(raceId as string),
    enabled: !!raceId
  })

  return { updateRace, fetchRaceById }
}