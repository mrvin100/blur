/**
 * Score Hooks
 * Custom hooks for score-related queries and mutations
 * Aligned with backend ScoreController endpoints
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scoreService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { CreateScoreDto } from '@/types/score.types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error-handler';

/**
 * Get score by ID
 */
export const useScore = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.scores.detail(id),
    queryFn: () => scoreService.getById(id),
    enabled: !!id,
  });
};

/**
 * Get scores by race ID
 */
export const useScoresByRace = (raceId: number | string) => {
  return useQuery({
    queryKey: queryKeys.scores.byRace(raceId),
    queryFn: () => scoreService.getByRaceId(raceId),
    enabled: !!raceId,
  });
};

/**
 * Get scores by user ID
 */
export const useScoresByUser = (userId: number | string) => {
  return useQuery({
    queryKey: queryKeys.scores.byUser(userId),
    queryFn: () => scoreService.getByUserId(userId),
    enabled: !!userId,
  });
};

/**
 * Get score by race ID and user ID
 */
export const useScoreByRaceAndUser = (raceId: number | string, userId: number | string) => {
  return useQuery({
    queryKey: [...queryKeys.scores.byRace(raceId), 'user', userId],
    queryFn: () => scoreService.getByRaceAndUser(raceId, userId),
    enabled: !!raceId && !!userId,
  });
};

/**
 * Submit score mutation
 */
export const useSubmitScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScoreDto) => scoreService.submit(data),
    onSuccess: (score) => {
      if (score.race?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byRace(score.race.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(score.race.id) });
      }
      if (score.user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byUser(score.user.id) });
      }
      toast.success('Score enregistré avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Update score mutation
 */
export const useUpdateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: CreateScoreDto }) =>
      scoreService.update(id, data),
    onSuccess: (score, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.detail(variables.id) });
      if (score.race?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byRace(score.race.id) });
      }
      if (score.user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byUser(score.user.id) });
      }
      toast.success('Score mis à jour avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Delete score mutation
 */
export const useDeleteScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => scoreService.delete(id),
    onSuccess: () => {
      toast.success('Score supprimé avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};
