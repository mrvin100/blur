"use client"

import { useQuery } from '@tanstack/react-query'

import { getAllParties } from '@/app/api/partyManagement/route'
import { PartiesCacheKeys } from './const'
import { getPartyById } from '../app/api/partyManagement/route';
export const useParties = (id?:number) => {
  const getParties = useQuery({
    queryKey: [PartiesCacheKeys.PartiesDetailsAccess],
    queryFn: getAllParties
  })
  const getPartyId = useQuery({
    queryKey: [PartiesCacheKeys.PartiesDetailsAccess, id],
    queryFn: () => getPartyById(id as number),
    enabled: !!id,
  })
  return { getParties, getPartyId }
}