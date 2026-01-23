/**
 * Score Hooks
 * Custom hooks for score-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scoreService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Score, CreateScoreDto, UpdateScoreDto } from '@/types/score.types';
import { toast } from 'sonner';

/**
 * Get all scores
 */
export const useScores = () => {
  return useQuery({
    queryKey: queryKeys.scores.lists(),
    queryFn: scoreService.getAll,
  });
};

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
 * Create score mutation
 */
export const useCreateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScoreDto) => scoreService.create(data),
    onSuccess: (score) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.lists() });
      if (score.race?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byRace(score.race.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(score.race.id) });
      }
      if (score.user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byUser(score.user.id) });
      }
      toast.success('Score submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit score');
    },
  });
};

/**
 * Update score mutation
 */
export const useUpdateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateScoreDto }) =>
      scoreService.update(id, data),
    onSuccess: (score, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.detail(variables.id) });
      if (score.race?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.scores.byRace(score.race.id) });
      }
      toast.success('Score updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update score');
    },
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
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.lists() });
      toast.success('Score deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete score');
    },
  });
};
