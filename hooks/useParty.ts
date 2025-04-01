import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/app/dashboard/layout";
import { PartyManagementCacheKeys } from "./const";
import { createPartyApi } from "@/app/api/party/route";

export const useParty = () => {
  const createParty = useMutation({
    mutationFn: () =>
      createPartyApi(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party],
      }),
  })

  return { createParty }
}