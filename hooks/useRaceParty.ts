import { useQuery } from "@tanstack/react-query"
import { RaceCacheKeys } from "./const"
import { getRaceByPartyId } from "@/app/api/race/route"

export const useRaceParty = (partyId: string) => {
  const fetchRaceByPartyId = useQuery({
    queryKey: [RaceCacheKeys.Race],
    queryFn: () => getRaceByPartyId(partyId)
  })
  return { fetchRaceByPartyId }
}