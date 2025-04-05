"use client"

import { useQuery } from '@tanstack/react-query'
import { Party } from '@/types/party.types'
import { getAllParties, getPartyById as getPartyByIdService } from '@/app/services/partyService'

export function useParties() {
  const getParties = useQuery<Party[]>({
    queryKey: ['parties'],
    queryFn: getAllParties
  })

  return {
    getParties,
    usePartyById: (id: string) => 
      useQuery<Party>({
        queryKey: ['party', id],
        queryFn: () => getPartyByIdService(id),
        enabled: !!id
      })
  }
}