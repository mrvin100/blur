import { getAllMaps, getRandomMap } from "@/app/services/mapService"
import { useQuery } from "@tanstack/react-query"
import { MapsCacheKey } from "./const"

export const useMaps = (raceId?:string) => {
  const getMaps = useQuery({
    queryKey: [MapsCacheKey.AllMaps],
    queryFn: () => getAllMaps()
  })

  const getRandomMapQuery = useQuery({
    queryKey: [MapsCacheKey.RandomMap],
    queryFn: () => getRandomMap(raceId as string)
  })

  return { getMaps, getRandomMapQuery }
}