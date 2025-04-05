import { useQuery } from "@tanstack/react-query"
import { RaceParametersCacheKeys } from "./const"
import { RaceParameter } from "@/types/raceParameters.types"

export const useRaceParameters = () => {
  const getRaceParameters = useQuery({
    queryKey: [RaceParametersCacheKeys.Parameters],
    queryFn: async (): Promise<RaceParameter[]> => {
      const response = await fetch('/api/raceParameters');
      if (!response.ok) {
        throw new Error('Failed to fetch race parameters');
      }
      const data = await response.json();
      return data.data;
    }
  })

  return { getRaceParameters }
}