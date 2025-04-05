import { getAllCars, getGlobalCarAttribution, getIndividualCarAttribution } from "../app/services/carService"
import { useQuery } from "@tanstack/react-query"
import { CarsCacheKeys } from "./const"

export const useCars = (players?: string[]) => {
  const getCars = useQuery({
    queryKey: [CarsCacheKeys.AllCars],
    queryFn: () => getAllCars()
  })
  const getIndividualCar = useQuery({
    queryKey: [CarsCacheKeys.IndividualCar],
    queryFn: () => getIndividualCarAttribution(players as string[])
  })
  const getGlobalCar = useQuery({
    queryKey: [CarsCacheKeys.GlobalCar],
    queryFn: () => getGlobalCarAttribution()
  })

  return { getCars, getIndividualCar, getGlobalCar }
}