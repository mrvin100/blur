import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Permission } from '@/types/auth';

export function usePermissions() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all permissions
  const getPermissions = useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/permissionManagement');
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || 'Failed to fetch permissions');
        } else {
          setError('An unexpected error occurred');
        }
        throw error;
      }
    },
    retry: 1,
  });

  // Create a new permission
  const createPermission = useMutation({
    mutationFn: async (name: string) => {
      try {
        const response = await axios.post('/api/permissionManagement', { name });
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.error || 'Failed to create permission');
        }
        throw new Error('An unexpected error occurred');
      }
    },
    onSuccess: () => {
      toast.success('Permission created successfully');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create permission', {
        description: error.message,
      });
    },
  });

  // Delete a permission
  const deletePermission = useMutation({
    mutationFn: async (permissionId: string) => {
      try {
        const response = await axios.delete(`/api/permissionManagement?permissionId=${permissionId}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.error || 'Failed to delete permission');
        }
        throw new Error('An unexpected error occurred');
      }
    },
    onSuccess: () => {
      toast.success('Permission deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete permission', {
        description: error.message,
      });
    },
  });

  return {
    getPermissions,
    createPermission,
    deletePermission,
    error,
  };
} 