import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/app/dashboard/layout";
import { PartyManagementCacheKeys } from "./const";
import { createPartyApi, getPartyById } from "@/app/api/party/route";

export const useParty = (partyId?: string) => {
  const createParty = useMutation({
    mutationFn: () =>
      createPartyApi(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Party],
      }),
  })
  const fetchPartyById = useQuery({
    queryKey: [PartyManagementCacheKeys.Party],
    queryFn: () => getPartyById(partyId as string)
  })

  return { createParty, fetchPartyById }
}