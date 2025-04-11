import { queryClient } from "@/app/(board)/dashboard/layout"
import { AddScoreRequestData } from "@/types/score.types"
import { Score } from "@/types/party.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PartyManagementCacheKeys, RaceCacheKeys, ScoreCacheKeys } from "./const"

export const useScore = (raceId?: string) => {
  const addScore = useMutation({
    mutationFn: async (data: AddScoreRequestData) => {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to add score');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ScoreCacheKeys.Score]
      })
      queryClient.invalidateQueries({
        queryKey: [RaceCacheKeys.Race]
      })
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party]
      })
    }
  })
  const updateScore = useMutation({
    mutationFn: async ({ data, scoreId }: { data: AddScoreRequestData, scoreId: string },) => {
      const response = await fetch(`/api/score?scoreId=${scoreId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to add score');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ScoreCacheKeys.Score]
      })
      queryClient.invalidateQueries({
        queryKey: [RaceCacheKeys.Race]
      })
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party]
      })
    }
  })

  const fetchScoreByRaceId = useQuery<Score[]>({
    queryKey: [ScoreCacheKeys.Score, raceId],
    queryFn: async () => {
      if (!raceId) throw new Error('Race ID is required');

      const response = await fetch(`/api/score?raceId=${raceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!raceId
  })

  return { addScore, updateScore, fetchScoreByRaceId }
}