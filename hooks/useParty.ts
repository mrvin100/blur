import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/app/dashboard/layout";
import { PartyManagementCacheKeys } from "./const";
import { createPartyApi, getParties, getPartyById } from "@/app/api/party/route";

export const useParty = (partyId?: string) => {
  const fetchPartyById = useQuery({
    queryKey: [PartyManagementCacheKeys.Party],
    queryFn: () => getPartyById(partyId as string),
    enabled: !!partyId
  })
  const createParty = useMutation({
    mutationFn: () =>
      createPartyApi(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [PartyManagementCacheKeys.Parties],
      }),
  })
  const fetchAllParties = useQuery({
    queryKey: [PartyManagementCacheKeys.Parties],
    queryFn: () => getParties()
  })


  return { fetchPartyById, createParty, fetchAllParties }
}