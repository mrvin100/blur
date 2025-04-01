import { getAllMaps, getRandomMap } from "@/app/api/map/route"
import { useQuery } from "@tanstack/react-query"
import { MapsCacheKey } from "./const"

export const useMaps = () => {
  const getMaps = useQuery({
    queryKey: [MapsCacheKey.AllMaps],
    queryFn: () => getAllMaps()
  })

  const getIndividualMap = useQuery({
    queryKey: [MapsCacheKey.IndividualMap],
    queryFn: () => getRandomMap()
  })
  return { getMaps, getIndividualMap }
}