import { getRaceById, getRaceByPartyId, updateRaceById } from "@/app/api/race/route"
import { queryClient } from "@/app/dashboard/layout"
import { Racer } from "@/types/party.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys } from "./const"

export const useRace = (raceId?:bigint) => {
  const updateRace = useMutation({
    mutationFn: ({ RaceUpdateRequest, raceId }: { RaceUpdateRequest: Racer[]; raceId: bigint }) => updateRaceById(RaceUpdateRequest, raceId),
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
    queryFn: () => getRaceById(raceId as bigint)
  })


  return { updateRace, fetchRaceById }
}