import { getAllCars, getCarsGlobalAttribution, getCarsIndividualAttribution } from "@/app/api/car/route"
import { useQuery } from "@tanstack/react-query"
import { CarsCacheKeys } from "./const"

export const useCars = (players?: string[]) => {
  const getCars = useQuery({
    queryKey: [CarsCacheKeys.AllCars],
    queryFn: () => getAllCars()
  })
  const getIndividualCar = useQuery({
    queryKey: [CarsCacheKeys.IndividualCar],
    queryFn: () => getCarsIndividualAttribution(players as string[])
  })
  const getGlobalCar = useQuery({
    queryKey: [CarsCacheKeys.GlobalCar],
    queryFn: () => getCarsGlobalAttribution()
  })

  return { getCars, getIndividualCar, getGlobalCar }
}