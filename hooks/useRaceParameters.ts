import { getAllRaceParameters } from "@/app/api/raceParameters/route"
import { useQuery } from "@tanstack/react-query"
import { RaceParametersCacheKeys } from "./const"

export const useRaceParameters = () => {
  const getRaceParameters = useQuery({
    queryKey: [RaceParametersCacheKeys.Parameters],
    queryFn: () => getAllRaceParameters()
  })

  return { getRaceParameters }
}