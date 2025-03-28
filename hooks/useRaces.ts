"use client"


import { getAllRaces, getRaceById } from "@/app/api/raceManagement/route"
import { RacesCacheKeys } from "./const"
import { useQuery } from "@tanstack/react-query"
import { getRacesByPartyId } from '../app/api/raceManagement/route';

export const useRaces = (id?: bigint) => {
    const getRaces = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess],
        queryFn: getAllRaces
      })

      const getRaceId = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess, id],
        queryFn: () => getRaceById(id as bigint),
        enabled: !!id
      })

      const getRacesPartyId = useQuery({
        queryKey: [RacesCacheKeys.RacesDetailsAccess, id],
        queryFn: () => getRacesByPartyId(id as bigint),
        enabled: !!id
      })
      return { getRaces, getRaceId, getRacesPartyId }
}