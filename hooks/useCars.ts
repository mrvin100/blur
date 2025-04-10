import { getAllCars, getGlobalCarAttribution, getIndividualCarAttribution } from "../app/services/carService"
import { useQuery } from "@tanstack/react-query"
import { CarsCacheKeys } from "./const"

export const useCars = (players?: string[], raceId?: string, hasCar?: boolean) => {
  const getCars = useQuery({
    queryKey: [CarsCacheKeys.AllCars],
    queryFn: () => getAllCars()
  })
  const getIndividualCar = useQuery({
    queryKey: [CarsCacheKeys.IndividualCar],
    queryFn: () => getIndividualCarAttribution(players as string[], raceId as string)
  })

  return { getCars, getIndividualCar }
}