import { useQuery } from "@tanstack/react-query"
import { UsersCacheKey } from "./const"
import { Users } from "@/types/user.types"

export const useUsers = () => {
  const getUsers = useQuery<Users[]>({
    queryKey: [UsersCacheKey.AllUsers],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data.data;
    }
  })
  
  return { getUsers }
}