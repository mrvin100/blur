import { getRaceById, updateRaceById } from "@/app/api/race/route"
import { queryClient } from "@/app/dashboard/layout"
import { Racer } from "@/types/party.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys } from "./const"

export const useRace = (raceId?: string) => {
  const updateRace = useMutation({
    mutationFn: ({ selectedRacers, raceId }: { selectedRacers: Racer[]; raceId: string }) => updateRaceById(selectedRacers, raceId),
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
    queryFn: () => getRaceById(raceId as string)
  })


  return { updateRace, fetchRaceById }
}