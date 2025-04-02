import { addScoreForUser } from "@/app/api/score/route"
import { queryClient } from "@/app/dashboard/layout"
import { AddScoreRequestData } from "@/types/score.types"
import { useMutation } from "@tanstack/react-query"
import { RaceCacheKeys, ScoreCacheKeys } from "./const"

export const useScore = () => {
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
  return { addScore }
}