import { getAllUsers } from "@/app/api/users/route"
import { useQuery } from "@tanstack/react-query"
import { UsersCacheKey } from "./const"

export const useUsers = () => {
  const getUsers = useQuery({
    queryKey: [UsersCacheKey.AllUsers],
    queryFn: () => getAllUsers()
  })
  return { getUsers }
}