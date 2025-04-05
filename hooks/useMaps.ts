import { getAllMaps, getRandomMap } from "@/app/services/mapService"
import { useQuery } from "@tanstack/react-query"
import { MapsCacheKey } from "./const"

export const useMaps = () => {
  const getMaps = useQuery({
    queryKey: [MapsCacheKey.AllMaps],
    queryFn: () => getAllMaps()
  })

  const getRandomMapQuery = useQuery({
    queryKey: [MapsCacheKey.RandomMap],
    queryFn: () => getRandomMap()
  })

  return { getMaps, getRandomMapQuery }
}