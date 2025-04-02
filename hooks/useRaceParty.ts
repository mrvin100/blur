import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys } from "./const"
import { addRace, getRaceByPartyId } from "@/app/api/race/route"
import { queryClient } from "@/app/dashboard/layout"

export const useRaceParty = (partyId: string) => {
  const fetchRaceByPartyId = useQuery({
    queryKey: [RaceCacheKeys.Race],
    queryFn: () => getRaceByPartyId(partyId)
  })

  const createRace = useMutation({
    mutationFn: () => addRace(partyId),
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