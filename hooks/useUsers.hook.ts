/**
 * User Hooks
 * Custom hooks for user-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import { toast } from 'sonner';

/**
 * Get all users
 * @param enabled - Optional flag to enable/disable the query (default: true)
 */
export const useUsers = (enabled: boolean = true) => {
  return useQuery<User[], Error>({
    queryKey: queryKeys.users.lists(),
    queryFn: userService.getAll,
    enabled,
  });
};

/**
 * Get user by ID
 */
export const useUser = (id: number | string) => {
  return useQuery<User, Error>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

/**
 * Create user mutation
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error((error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create user');
    },
  });
};

/**
 * Update user mutation
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateUserDto }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error((error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update user');
    },
  });
};

/**
 * Delete user mutation
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error((error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete user');
    },
  });
};
