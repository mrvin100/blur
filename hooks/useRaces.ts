"use client"


import { getAllRaces, getRaceById, getRacesByPartyId } from "@/app/api/raceManagement/route"
import { RacesCacheKeys } from "./const"
import { useQuery } from "@tanstack/react-query"

export const useRaces = (id?: number) => {
    const getRaces = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess],
        queryFn: getAllRaces
      })

      

      const getRacesPartyId = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess, id],
        queryFn: () => getRacesByPartyId(id as number),
        enabled: !!id
      })
      const getRaceId = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess, id],
        queryFn: () => getRaceById(id as number)
      })
      return { getRaces,  getRacesPartyId,getRaceId }
}