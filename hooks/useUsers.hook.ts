/**
 * User Hooks
 * Custom hooks for user-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error-handler';

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
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: Error) => handleApiError(error),
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
      toast.success('Utilisateur mis à jour avec succès');
    },
    onError: (error: Error) => handleApiError(error),
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
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Get current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: [...queryKeys.users.all, 'me'],
    queryFn: userService.getCurrentUser,
  });
};

/**
 * Update user's own profile mutation
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateUserDto }) =>
      userService.updateProfile(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.users.all, 'me'] });
      toast.success('Profil mis à jour avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Assign single role to user mutation (legacy)
 */
export const useAssignUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number | string; role: string }) =>
      userService.assignRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('Rôle assigné avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Assign multiple roles to user mutation
 */
export const useAssignUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roles }: { id: number | string; roles: string[] }) =>
      userService.assignRoles(id, roles),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('Rôles assignés avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Remove role from user mutation
 */
export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number | string; role: string }) =>
      userService.removeRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('Rôle retiré avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Get all available roles
 */
export const useAvailableRoles = () => {
  return useQuery<string[], Error>({
    queryKey: [...queryKeys.users.all, 'roles'],
    queryFn: userService.getAllRoles,
  });
};
