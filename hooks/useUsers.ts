import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { User } from '@/types/auth';

type CreateUserData = {
  userName: string;
  password: string;
  permissionsIds: number[];
};

export function useUsers() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all users
  const getUsers = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/userManagement');
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || 'Failed to fetch users');
        } else {
          setError('An unexpected error occurred');
        }
        throw error;
      }
    },
    retry: 1,
  });

  // Fetch a user by ID
  const useUserById = (userId: string) => {
    return useQuery<User, Error>({
      queryKey: ['users', userId],
      queryFn: async () => {
        try {
          const response = await axios.get(`/api/userManagement?userId=${userId}`);
          return response.data.data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Failed to fetch user');
          }
          throw new Error('An unexpected error occurred');
        }
      },
      enabled: !!userId,
      retry: 1,
    });
  };

  // Create a new user
  const createUser = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      try {
        const response = await axios.post('/api/userManagement', userData);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.error || 'Failed to create user');
        }
        throw new Error('An unexpected error occurred');
      }
    },
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create user', {
        description: error.message,
      });
    },
  });

  return {
    getUsers,
    useUserById,
    createUser,
    error,
  };
}