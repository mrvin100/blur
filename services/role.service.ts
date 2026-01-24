import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';

export type RoleDto = {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
};

export type AddRoleDto = {
  name: string;
  description?: string;
  permissions: string[];
};

export type UpdateRoleDto = {
  description?: string;
  permissions?: string[];
};

const ENDPOINTS = {
  BASE: 'roles',
  BY_ID: (id: number | string) => `roles/${id}`,
};

export const roleService = {
  getAll: async (): Promise<RoleDto[]> => {
    const res = await apiClient.get(ENDPOINTS.BASE).json<ApiResponse<RoleDto[]>>();
    return res.data;
  },
  create: async (data: AddRoleDto): Promise<RoleDto> => {
    const res = await apiClient.post(ENDPOINTS.BASE, { json: data }).json<ApiResponse<RoleDto>>();
    return res.data;
  },
  update: async (id: number | string, data: UpdateRoleDto): Promise<RoleDto> => {
    const res = await apiClient.put(ENDPOINTS.BY_ID(id), { json: data }).json<ApiResponse<RoleDto>>();
    return res.data;
  },
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.BY_ID(id));
  },
};

export default roleService;
