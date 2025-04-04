import { addScoreForUser, getScoreByRaceId } from "@/app/api/score/route"
import { queryClient } from "@/app/dashboard/layout"
import { AddScoreRequestData } from "@/types/score.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RaceCacheKeys, ScoreCacheKeys } from "./const"

export const useScore = (raceId?: string) => {
  const addScore = useMutation({
    mutationFn: (data: AddScoreRequestData) => addScoreForUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ScoreCacheKeys.Score]
      })
      queryClient.invalidateQueries({
        queryKey: [RaceCacheKeys.Race]
      })
    }
  })
  const fetchScoreByRaceId = useQuery({
    queryKey: [ScoreCacheKeys.Score, raceId],
    queryFn: () => getScoreByRaceId(raceId as string)
  })

  return { addScore, fetchScoreByRaceId }
}