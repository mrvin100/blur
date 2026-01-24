import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { RoleDto, AddRoleDto, UpdateRoleDto } from '@/services/role.service';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error-handler';

export const useRoles = () => {
  return useQuery<RoleDto[], Error>({
    queryKey: [...queryKeys.users.all, 'roles-list'],
    queryFn: roleService.getAll,
  });
};

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddRoleDto) => roleService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...queryKeys.users.all, 'roles-list'] });
      toast.success('Role created successfully');
    },
    onError: (err: Error) => handleApiError(err),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateRoleDto }) => roleService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...queryKeys.users.all, 'roles-list'] });
      toast.success('Role updated successfully');
    },
    onError: (err: Error) => handleApiError(err),
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => roleService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...queryKeys.users.all, 'roles-list'] });
      toast.success('Role deleted successfully');
    },
    onError: (err: Error) => handleApiError(err),
  });
};
